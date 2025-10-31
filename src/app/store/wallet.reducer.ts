import { createFeature, createReducer, on } from "@ngrx/store";
import { WalletActions } from "./wallet.actions";

export interface WalletState {
    connected: boolean;
    chainId: string;
    accounts: string[];
    nftId: number;
}

export const walletState: WalletState = {
    connected: false,
    chainId: '0x0',
    accounts: [],
    nftId: 0
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
        accounts: [],
        nftId: 0
    })),
    on(WalletActions.changeChain, WalletActions.changeChainSuccess, (state, {chainId}) => ({
        ...state,
        chainId: chainId
    })),
    on(WalletActions.setAccountNft, (state, { nftId }) => ({
        ...state,
        nftId
    }))
);

export const walletFeature = createFeature({
    name: "wallet",
    reducer: walletReducer
});
