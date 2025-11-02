import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WalletState } from "./wallet.reducer";

export const selectWallet = createFeatureSelector<WalletState>('wallet');

export const selectIsConnected = createSelector(
    selectWallet,
    (state) => state.connected
);

export const selectAccounts = createSelector(
    selectWallet,
    (state) => state.accounts
);

export const selectChainId = createSelector(
    selectWallet,
    (state) => state.chainId
);

export const selectNftAccountId = createSelector(
    selectWallet,
    (state) => state.nftId
);

export const selectBalances = createSelector(
    selectWallet,
    (state) => ({ credits: state.balanceCredits, eth: state.balanceEth})
);
