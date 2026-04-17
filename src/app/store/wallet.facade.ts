import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaMaskService } from '../wallets/metamask.service';
import {
    selectIsConnected,
    selectAccounts,
    selectChainId,
    selectNftAccountId,
    selectBalances,
    selectChangeIsPending,
    selectWalletProviders,
} from './wallet.selectors';
import { catchError, filter, firstValueFrom, Observable, of } from 'rxjs';
import { WalletActions } from './wallet.actions';
import { getNetwork } from '../blockchain/networks';
import { NetworkConstants } from '../blockchain/networks.constants';
import { ChangeConstants } from './changes.constants';
import { CreditsManagerService } from '../blockchain/contracts/credits-manager.service';
import { NftService } from '../blockchain/contracts/nft.service';
import { EIP6963Info } from './wallet.types';

@Injectable({
    providedIn: 'root',
})
export class WalletFacade {
    private _store = inject(Store);
    private _mm = inject(MetaMaskService);
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
        const chainId = await firstValueFrom(this.getChainId());
        const txHash = await firstValueFrom(
            this._mm.transact(
                'mintAccountToken(address)',
                [
                    {
                        arg: this._mm.getActiveAccount(false),
                        encode: false,
                    },
                ],
                getNetwork(chainId).contracts.nft,
                this._mm.getActiveAccount(),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.NEW_ACCOUNT }));

        let sub = this._mm.receipt(txHash).subscribe((result) => {
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
        const chainId = await firstValueFrom(this.getChainId());
        const accountId = await firstValueFrom(this.getNftAccountId());

        const txHash = await firstValueFrom(
            this._mm.transact(
                'cashOutCredits(uint256)',
                [
                    {
                        arg: accountId,
                    },
                ],
                getNetwork(chainId).contracts.creditsMgr,
                this._mm.getActiveAccount(),
            ),
        );

        this._store.dispatch(
            WalletActions.changesPending({ what: ChangeConstants.REDEEM_CREDITS }),
        );

        let sub = this._mm.receipt(txHash).subscribe((result) => {
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
        const chainId = await firstValueFrom(this.getChainId());
        const { decimals } = getNetwork(chainId).nativeCurrency;
        const factor = 10n ** BigInt(decimals);

        const txHash = await firstValueFrom(
            this._mm.transact(
                'depositCredits()',
                [],
                getNetwork(chainId).contracts.creditsMgr,
                this._mm.getActiveAccount(),
                BigInt(Math.floor(amount)) * factor +
                    BigInt(Math.round((amount % 1) * Number(factor))),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.BUY_CREDITS }));

        let sub = this._mm.receipt(txHash).subscribe((result) => {
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
        const chainId = await firstValueFrom(this.getChainId());

        const txHash = await firstValueFrom(
            this._mm.transact(
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
                this._mm.getActiveAccount(),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.SEND_CREDITS }));

        let sub = this._mm.receipt(txHash).subscribe((result) => {
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
        const chainId = await firstValueFrom(this.getChainId());
        const { decimals } = getNetwork(chainId).nativeCurrency;
        const factor = 10n ** BigInt(decimals);

        const txHash = await firstValueFrom(
            this._mm.transact(
                'SendTipRaw(uint256)',
                [
                    {
                        arg: to,
                    },
                ],
                getNetwork(chainId).contracts.tipper,
                this._mm.getActiveAccount(),
                BigInt(Math.floor(amount)) * factor +
                    BigInt(Math.round((amount % 1) * Number(factor))),
            ),
        );

        this._store.dispatch(WalletActions.changesPending({ what: ChangeConstants.SEND_NATIVE }));

        let sub = this._mm.receipt(txHash).subscribe((result) => {
            if (result !== undefined && result !== null) {
                if (result.status === '0x1') {
                    this._updateBalances()
                        .then(() => this._store.dispatch(WalletActions.clearPendingChanges()))
                        .then(() => sub.unsubscribe());
                }
            }
        });
    }

    private async _updateBalances() {
        const chainId = await firstValueFrom(this.getChainId());
        const activeAcct = this._mm.getActiveAccount();

        const native = await firstValueFrom(this._mm.getBalance(activeAcct, chainId));

        const credits = await firstValueFrom(this._creditsMgr.balanceOf(activeAcct, chainId));

        this._store.dispatch(WalletActions.setBalances({ credits, native }));
    }

    private async _updateNftData() {
        const chainId = await firstValueFrom(this.getChainId());

        const balance = await firstValueFrom(
            this._nft.balanceOf(this._mm.getActiveAccount(), chainId),
        );

        if (balance > 0) {
            const tokenId = await firstValueFrom(
                this._nft.getAccountTokenId(this._mm.getActiveAccount(), chainId),
            );

            this._store.dispatch(WalletActions.setAccountNft({ nftId: tokenId }));
        } else {
            this._store.dispatch(WalletActions.setAccountNft({ nftId: 0 }));
        }
    }
}
