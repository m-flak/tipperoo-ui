import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaMaskService } from '../metamask/metamask.service';
import {
    selectIsConnected,
    selectAccounts,
    selectChainId,
    selectNftAccountId,
    selectBalances,
    selectChangeIsPending,
} from './wallet.selectors';
import { catchError, filter, firstValueFrom, Observable, of } from 'rxjs';
import { WalletActions } from './wallet.actions';
import { getNetwork } from '../blockchain/networks';
import { NetworkConstants } from '../blockchain/networks.constants';
import { ChangeConstants } from './changes.constants';

@Injectable({
    providedIn: 'root',
})
export class WalletFacade {
    private _store = inject(Store);
    private _mm = inject(MetaMaskService);

    constructor() {}

    getIsConnected = () => this._store.select(selectIsConnected);
    getAccounts = () => this._store.select(selectAccounts);
    getChainId = () => this._store.select(selectChainId);
    getNftAccountId = () => this._store.select(selectNftAccountId);
    getBalances = () => this._store.select(selectBalances);
    getChangePending = (what: string) => this._store.select(selectChangeIsPending(what));

    async connectWallet() {
        this._store.dispatch(WalletActions.connect());

        await this._updateNftData();
        await this._updateBalances();
    }

    disconnectWallet() {
        this._store.dispatch(WalletActions.disconnect());
    }

    async switchNetwork() {
        let chainId = await firstValueFrom(this.getChainId());
        if (chainId === NetworkConstants.SCROLL_SEPOLIA) {
            chainId = NetworkConstants.SCROLL;
            this._store.dispatch(WalletActions.changeChain({ chainId }));
        } else {
            chainId = NetworkConstants.SCROLL_SEPOLIA;
            this._store.dispatch(WalletActions.changeChain({ chainId }));
        }

        await this._updateNftData();
        await this._updateBalances();
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

    async buyCredits(amount: number) {
        const chainId = await firstValueFrom(this.getChainId());

        const txHash = await firstValueFrom(
            this._mm.transact(
                'depositCredits()',
                [],
                getNetwork(chainId).contracts.creditsMgr,
                this._mm.getActiveAccount(),
                BigInt(amount * 1e18),
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
    private async _updateBalances() {
        const chainId = await firstValueFrom(this.getChainId());
        const activeAcct = this._mm.getActiveAccount();

        const eth = await firstValueFrom(this._mm.getBalance(activeAcct));

        const credits = Number(
            await firstValueFrom(
                this._mm
                    .call(
                        'balanceOf(address)',
                        [
                            {
                                arg: this._mm.getActiveAccount(false),
                                encode: false,
                            },
                        ],
                        getNetwork(chainId).contracts.creditsMgr,
                    )
                    .pipe(catchError(() => of(0))),
            ),
        );

        this._store.dispatch(WalletActions.setBalances({ credits, eth }));
    }

    // todo: move contract interaction to svc
    private async _updateNftData() {
        const chainId = await firstValueFrom(this.getChainId());

        const balance = Number(
            await firstValueFrom(
                this._mm
                    .call(
                        'balanceOf(address)',
                        [
                            {
                                arg: this._mm.getActiveAccount(false),
                                encode: false,
                            },
                        ],
                        getNetwork(chainId).contracts.nft,
                    )
                    .pipe(catchError(() => of(0))),
            ),
        );

        if (balance > 0) {
            const tokenId = Number(
                await firstValueFrom(
                    this._mm
                        .call(
                            'getAccountTokenId(address)',
                            [
                                {
                                    arg: this._mm.getActiveAccount(false),
                                    encode: false,
                                },
                            ],
                            getNetwork(chainId).contracts.nft,
                        )
                        .pipe(
                            catchError(() => of(0)), // 0 is no account nft
                        ),
                ),
            );

            this._store.dispatch(WalletActions.setAccountNft({ nftId: tokenId }));
        } else {
            this._store.dispatch(WalletActions.setAccountNft({ nftId: 0 }));
        }
    }
}
