import { createFeature, createReducer, on } from '@ngrx/store';
import { WalletActions } from './wallet.actions';
import { EIP6963Info } from './wallet.types';

export interface WalletState {
    pendingChanges: string | null;

    wallets: EIP6963Info[];

    connected: boolean;
    chainId: string;

    accounts: string[];
    nftId: number;

    balanceCredits: number;
    balanceEth: number;
}

export const walletState: WalletState = {
    pendingChanges: null,

    wallets: [],

    connected: false,
    chainId: '0x0',

    accounts: [],
    nftId: 0,

    balanceCredits: 0,
    balanceEth: 0,
};

export const walletReducer = createReducer(
    walletState,
    on(WalletActions.addWalletProvider, (state, { info }) => {
        if (!state.wallets.find((w) => w.uuid === info.uuid)) {
            return {
                ...state,
                wallets: [...state.wallets, info],
            };
        }
        // wallet info already present, change nothing
        return state;
    }),
    on(WalletActions.connectSuccess, (state, { accounts, chainId }) => ({
        ...state,
        connected: true,
        chainId: chainId,
        accounts: accounts,
    })),
    on(WalletActions.disconnect, (state) => ({
        ...state,
        connected: false,
        chainId: '0x0',
        accounts: [],
        nftId: 0,
        balanceCredits: 0,
        balanceEth: 0,
    })),
    on(WalletActions.changeChain, WalletActions.changeChainSuccess, (state, { chainId }) => ({
        ...state,
        chainId: chainId,
    })),
    on(WalletActions.setAccountNft, (state, { nftId }) => ({
        ...state,
        nftId,
    })),
    on(WalletActions.setBalances, (state, { credits, eth }) => ({
        ...state,
        balanceCredits: credits,
        balanceEth: eth,
    })),
    on(WalletActions.changesPending, (state, { what }) => ({
        ...state,
        pendingChanges: what,
    })),
    on(WalletActions.clearPendingChanges, (state) => ({
        ...state,
        pendingChanges: null,
    })),
);

export const walletFeature = createFeature({
    name: 'wallet',
    reducer: walletReducer,
});
