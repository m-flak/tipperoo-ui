import { createFeature, createReducer, on } from "@ngrx/store";
import { WalletActions } from "./wallet.actions";

export interface WalletState {
    connected: boolean;
    chainId: string;
    accounts: string[];
}

export const walletState: WalletState = {
    connected: false,
    chainId: '0x0',
    accounts: []
}

export const walletReducer = createReducer(
    walletState,
    on(WalletActions.connectSuccess, (state, { accounts, chainId }) => ({
        ...state,
        connected: true,
        chainId: chainId,
        accounts: accounts
    })),
    on(WalletActions.disconnect, (state) => ({
        ...state,
        connected: false,
        chainId: '0x0',
        accounts: []
    }))
);

export const walletFeature = createFeature({
    name: "wallet",
    reducer: walletReducer
});
