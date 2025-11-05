import { filter, map, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { WalletActions } from './wallet.actions';
import { MetaMaskService } from '../metamask/metamask.service';
import { NetworkConstants } from '../blockchain/networks.constants';

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

// FIXME: Move contract interaction code from facade to appropiate svcs then use here
////////// to update the nft & balance data
// // TODO: Change to mainnet
// export const uponConnectSuccessSetChain = createEffect(
//     (actions$ = inject(Actions)) =>
//         actions$.pipe(
//             ofType(WalletActions.connectSuccess),
//             map(() => WalletActions.changeChain({ chainId: NetworkConstants.SCROLL_SEPOLIA }))
//         ),
//         { functional: true, dispatch: true}
// );

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
