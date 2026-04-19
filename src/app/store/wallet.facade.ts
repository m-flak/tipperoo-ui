import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { WalletService } from '../wallets/wallet.service';
import {
    selectIsConnected,
    selectAccounts,
    selectChainId,
    selectNftAccountId,
    selectBalances,
    selectChangeIsPending,
    selectWalletProviders,
    selectActiveWalletName,
} from './wallet.selectors';
import { catchError, filter, firstValueFrom, Observable, of } from 'rxjs';
import { WalletActions } from './wallet.actions';
import { getNetwork } from '../blockchain/networks';
import { NetworkConstants } from '../blockchain/networks.constants';
import { ChangeConstants } from './changes.constants';
import { CreditsManagerService } from '../blockchain/contracts/credits-manager.service';
import { NftService } from '../blockchain/contracts/nft.service';
import { EIP6963Info } from './wallet.types';
import { IWalletService } from '../wallets/wallet-svc.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletFacade {
    private _store = inject(Store);
    private _walletSvc = inject(WalletService);
    private _creditsMgr = inject(CreditsManagerService);
    private _nft = inject(NftService);

    constructor() {}

    getWalletProviders = () => this._store.select(selectWalletProviders);
    getIsConnected = () => this._store.select(selectIsConnected);
    getAccounts = () => this._store.select(selectAccounts);
    getChainId = () => this._store.select(selectChainId);
    getNftAccountId = () => this._store.select(selectNftAccountId);
    getBalances = () => this._store.select(selectBalances);
    getChangePending = (what: string) => this._store.select(selectChangeIsPending(what));

    addWalletProvider(info: EIP6963Info) {
        this._store.dispatch(WalletActions.addWalletProvider({ info }));
    }

    async connectWallet(providerName: string) {
        this._store.dispatch(WalletActions.connect({ providerName }));
    }

    disconnectWallet() {
        this._store.dispatch(WalletActions.disconnect());
    }

    switchNetwork(chainId: string) {
        this._store.dispatch(WalletActions.changeChain({ chainId }));
    }

    // todo: move contract interaction to svc
    async createAccount() {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const txHash = await firstValueFrom(
            wallet.transact(
                'mintAccountToken(address)',
                [
                    {
                        arg: wallet.getActiveAccount(false),
                        encode: false,
                    },
                ],
                getNetwork(chainId).contracts.nft,
                wallet.getActiveAccount(),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.NEW_ACCOUNT }));

        let sub = wallet.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateNftData()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    // todo: move contract interaction to svc
    async redeemCredits() {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const accountId = await firstValueFrom(this.getNftAccountId());

        const txHash = await firstValueFrom(
            wallet.transact(
                'cashOutCredits(uint256)',
                [
                    {
                        arg: accountId,
                    },
                ],
                getNetwork(chainId).contracts.creditsMgr,
                wallet.getActiveAccount(),
            ),
        );

        this._store.dispatch(
            WalletActions.changesPending({ what: ChangeConstants.REDEEM_CREDITS }),
        );

        let sub = wallet.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateBalances()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    // todo: move contract interaction to svc
    async buyCredits(amount: number) {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const { decimals } = getNetwork(chainId).nativeCurrency;
        const factor = 10n ** BigInt(decimals);

        const txHash = await firstValueFrom(
            wallet.transact(
                'depositCredits()',
                [],
                getNetwork(chainId).contracts.creditsMgr,
                wallet.getActiveAccount(),
                BigInt(Math.floor(amount)) * factor +
                    BigInt(Math.round((amount % 1) * Number(factor))),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.BUY_CREDITS }));

        let sub = wallet.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateBalances()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    // todo: move contract interaction to svc
    async sendCredits(amount: number, to: number) {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());

        const txHash = await firstValueFrom(
            wallet.transact(
                'SendTipCredits(uint256,uint256)',
                [
                    {
                        arg: amount,
                    },
                    {
                        arg: to,
                    },
                ],
                getNetwork(chainId).contracts.tipper,
                wallet.getActiveAccount(),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.SEND_CREDITS }));

        let sub = wallet.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateBalances()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    // todo: move contract interaction to svc
    async sendNative(amount: number, to: number) {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const { decimals } = getNetwork(chainId).nativeCurrency;
        const factor = 10n ** BigInt(decimals);

        const txHash = await firstValueFrom(
            wallet.transact(
                'SendTipRaw(uint256)',
                [
                    {
                        arg: to,
                    },
                ],
                getNetwork(chainId).contracts.tipper,
                wallet.getActiveAccount(),
                BigInt(Math.floor(amount)) * factor +
                    BigInt(Math.round((amount % 1) * Number(factor))),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.SEND_NATIVE }));

        let sub = wallet.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateBalances()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    private async _getActiveWallet(): Promise<IWalletService> {
        const name = await firstValueFrom(this._store.select(selectActiveWalletName));
        return this._walletSvc.getWalletProvider(name);
    }

    private async _updateBalances() {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const activeAcct = wallet.getActiveAccount();

        const native = await firstValueFrom(wallet.getBalance(activeAcct, chainId));

        const credits = await firstValueFrom(this._creditsMgr.balanceOf(wallet,activeAcct, chainId));

        this._store.dispatch(WalletActions.setBalances({ credits, native }));
    }

    private async _updateNftData() {
        const wallet = await this._getActiveWallet();
        const chainId = await firstValueFrom(this.getChainId());
        const activeAcct = wallet.getActiveAccount();

        const balance = await firstValueFrom(this._nft.balanceOf(wallet, activeAcct, chainId));

        if (balance > 0) {
            const tokenId = await firstValueFrom(
                this._nft.getAccountTokenId(wallet, activeAcct, chainId),
            );
            this._store.dispatch(WalletActions.setAccountNft({ nftId: tokenId }));
        } else {
            this._store.dispatch(WalletActions.setAccountNft({ nftId: 0 }));
        }
    }
}
