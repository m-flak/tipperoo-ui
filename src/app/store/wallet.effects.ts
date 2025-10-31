import { map, switchMap } from "rxjs";
import { inject } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { WalletActions } from "./wallet.actions";
import { MetaMaskService } from "../metamask/metamask.service";

export const uponConnect = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) => 
        actions$.pipe(
            ofType(WalletActions.connect),
            switchMap(() => mm.connectWallet()),
            switchMap(accounts => mm.getChainId().pipe(
                map(chainId => ({accounts, chainId}))
            )),
            map(({accounts, chainId}) => WalletActions.connectSuccess({ accounts, chainId }))
        ),
        { functional: true, dispatch: true}
);

export const uponDisconnect = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) => 
        actions$.pipe(
            ofType(WalletActions.disconnect),
            switchMap(() => mm.disconnectWallet().pipe())
        ),
        { functional: true, dispatch: false }
);

export const uponChangeChain = createEffect(
    (actions$ = inject(Actions), mm = inject(MetaMaskService)) => 
        actions$.pipe(
            ofType(WalletActions.changeChain),
            switchMap(({chainId}) => mm.changeChain(chainId)),
            map(chainId => WalletActions.changeChainSuccess({ chainId }))
        ),
        { functional: true, dispatch: true }
);
