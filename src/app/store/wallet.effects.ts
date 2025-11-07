import { filter, map, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { WalletActions } from './wallet.actions';
import { MetaMaskService } from '../metamask/metamask.service';
import { NetworkConstants } from '../blockchain/networks.constants';
import { CreditsManagerService } from '../blockchain/contracts/credits-manager.service';
import { NftService } from '../blockchain/contracts/nft.service';

export const uponConnect = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) =>
        actions$.pipe(
            ofType(WalletActions.connect),
            switchMap(() => mm.connectWallet()),
            switchMap((accounts) =>
                mm.getChainId().pipe(map((chainId) => ({ accounts, chainId }))),
            ),
            filter(() => mm.connected),
            map(({ accounts, chainId }) => WalletActions.connectSuccess({ accounts, chainId })),
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
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) =>
        actions$.pipe(
            ofType(WalletActions.disconnect),
            switchMap(() => mm.disconnectWallet().pipe()),
        ),
    { functional: true, dispatch: false },
);

export const uponChangeChain = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) =>
        actions$.pipe(
            ofType(WalletActions.changeChain),
            switchMap(({ chainId }) => mm.changeChain(chainId)),
            map((chainId) => WalletActions.changeChainSuccess({ chainId })),
        ),
    { functional: true, dispatch: true },
);

export const uponChangeChainSuccessSetBalances = createEffect(
    (
        actions$ = inject(Actions),
        mm = inject(MetaMaskService),
        creditsMgr = inject(CreditsManagerService),
    ) =>
        actions$.pipe(
            ofType(WalletActions.changeChainSuccess),
            switchMap(({ chainId }) => creditsMgr.balanceOf(mm.getActiveAccount(), chainId)),
            switchMap((credits) =>
                mm.getBalance(mm.getActiveAccount()).pipe(map((eth) => ({ credits, eth }))),
            ),
            map((creditsEth) => WalletActions.setBalances(creditsEth)),
        ),
    { functional: true, dispatch: true },
);

export const uponChangeChainSuccessUpdateNftData = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService), nft = inject(NftService)) =>
        actions$.pipe(
            ofType(WalletActions.changeChainSuccess),
            switchMap(({ chainId }) =>
                nft.balanceOf(mm.getActiveAccount(), chainId).pipe(
                    switchMap((balance) => {
                        if (balance < 1) {
                            return of(0); // 0 means no account nft
                        }
                        return nft.getAccountTokenId(mm.getActiveAccount(), chainId);
                    }),
                ),
            ),
            map((id) => WalletActions.setAccountNft({ nftId: id })),
        ),
    { functional: true, dispatch: true },
);
