import { filter, map, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { WalletActions } from './wallet.actions';
import { walletFeature } from './wallet.reducer';
import { WalletService } from '../wallets/wallet.service';
import { NetworkConstants } from '../blockchain/networks.constants';
import { CreditsManagerService } from '../blockchain/contracts/credits-manager.service';
import { NftService } from '../blockchain/contracts/nft.service';

export const uponConnect = createEffect(
    (actions$ = inject(Actions), walletSvc = inject(WalletService)) =>
        actions$.pipe(
            ofType(WalletActions.connect),
            switchMap(({ providerName }) => {
                const provider = walletSvc.getWalletProvider(providerName);
                return provider.connectWallet().pipe(
                    switchMap((accounts) =>
                        provider.getChainId().pipe(map((chainId) => ({ accounts, chainId }))),
                    ),
                    filter(() => provider.connected),
                    map(({ accounts, chainId }) =>
                        WalletActions.connectSuccess({ accounts, chainId }),
                    ),
                );
            }),
        ),
    { functional: true, dispatch: true },
);

// TODO: Change to mainnet
export const uponConnectSuccessSetChain = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(WalletActions.connectSuccess),
            map(() => WalletActions.changeChain({ chainId: NetworkConstants.SCROLL_SEPOLIA })),
        ),
    { functional: true, dispatch: true },
);

export const uponDisconnect = createEffect(
    (actions$ = inject(Actions), walletSvc = inject(WalletService), store = inject(Store)) =>
        actions$.pipe(
            ofType(WalletActions.disconnect),
            concatLatestFrom(() => store.select(walletFeature.selectWallet)),
            switchMap(([, wallet]) => walletSvc.getWalletProvider(wallet).disconnectWallet()),
        ),
    { functional: true, dispatch: false },
);

export const uponChangeChain = createEffect(
    (actions$ = inject(Actions), walletSvc = inject(WalletService), store = inject(Store)) =>
        actions$.pipe(
            ofType(WalletActions.changeChain),
            concatLatestFrom(() => store.select(walletFeature.selectWallet)),
            switchMap(([{ chainId }, wallet]) =>
                walletSvc.getWalletProvider(wallet).changeChain(chainId),
            ),
            map((chainId) => WalletActions.changeChainSuccess({ chainId })),
        ),
    { functional: true, dispatch: true },
);

export const uponChangeChainSuccessSetBalances = createEffect(
    (
        actions$ = inject(Actions),
        walletSvc = inject(WalletService),
        store = inject(Store),
        creditsMgr = inject(CreditsManagerService),
    ) =>
        actions$.pipe(
            ofType(WalletActions.changeChainSuccess),
            concatLatestFrom(() => store.select(walletFeature.selectWallet)),
            switchMap(([{ chainId }, wallet]) => {
                const provider = walletSvc.getWalletProvider(wallet);
                return creditsMgr
                    .balanceOf(provider.getActiveAccount(), chainId)
                    .pipe(
                        switchMap((credits) =>
                            provider
                                .getBalance(provider.getActiveAccount())
                                .pipe(map((eth) => ({ credits, eth }))),
                        ),
                    );
            }),
            map((creditsEth) => WalletActions.setBalances(creditsEth)),
        ),
    { functional: true, dispatch: true },
);

export const uponChangeChainSuccessUpdateNftData = createEffect(
    (
        actions$ = inject(Actions),
        walletSvc = inject(WalletService),
        store = inject(Store),
        nft = inject(NftService),
    ) =>
        actions$.pipe(
            ofType(WalletActions.changeChainSuccess),
            concatLatestFrom(() => store.select(walletFeature.selectWallet)),
            switchMap(([{ chainId }, wallet]) => {
                const provider = walletSvc.getWalletProvider(wallet);
                return nft.balanceOf(provider.getActiveAccount(), chainId).pipe(
                    switchMap((balance) => {
                        if (balance < 1) {
                            return of(0); // 0 means no account nft
                        }
                        return nft.getAccountTokenId(provider.getActiveAccount(), chainId);
                    }),
                );
            }),
            map((id) => WalletActions.setAccountNft({ nftId: id })),
        ),
    { functional: true, dispatch: true },
);
