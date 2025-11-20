import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EIP6963Info } from './wallet.types';

export const WalletActions = createActionGroup({
    source: 'Wallet',
    events: {
        'Add Wallet Provider': props<{ info: EIP6963Info }>(),
        Connect: emptyProps(),
        'Connect Success': props<{ accounts: string[]; chainId: string }>(),
        Disconnect: emptyProps(),
        'Change Chain': props<{ chainId: string }>(),
        'Change Chain Success': props<{ chainId: string }>(),
        'Set Account Nft': props<{ nftId: number }>(),
        'Set Balances': props<{ credits: number; eth: number }>(),
        'Changes Pending': props<{ what: string }>(),
        'Clear Pending Changes': emptyProps(),
    },
});
