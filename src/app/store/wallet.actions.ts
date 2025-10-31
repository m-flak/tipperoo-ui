import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const WalletActions = createActionGroup({
    source: 'Wallet',
    events: {
        'Connect': emptyProps(),
        'Connect Success': props<{accounts: string[], chainId: string}>(),
        'Disconnect': emptyProps()
    }
});
