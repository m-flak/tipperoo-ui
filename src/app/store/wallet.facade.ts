import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { MetaMaskService } from "../metamask/metamask.service";
import { selectIsConnected, selectAccounts, selectChainId } from "./wallet.selectors";
import { filter, firstValueFrom, Observable } from "rxjs";
import { WalletActions } from "./wallet.actions";
import { getNetwork } from "../metamask/networks";

@Injectable({
    providedIn: 'root'
})
export class WalletFacade {
    private _store = inject(Store);
    private _mm = inject(MetaMaskService);

    constructor() {}

    getIsConnected = () => this._store.select(selectIsConnected);
    getAccounts = () => this._store.select(selectAccounts);
    getChainId = () => this._store.select(selectChainId);

    async connectWallet() {
        this._store.dispatch(WalletActions.connect());

        await this._updateNftData();
    }

    disconnectWallet() {
        this._store.dispatch(WalletActions.disconnect());
    }

    async switchNetwork() {
        let chainId = await firstValueFrom(this.getChainId());
        if (chainId === "0x8274F") {
            chainId = "0x82750";
            this._store.dispatch(WalletActions.changeChain({ chainId }));
        } else {
            chainId = "0x8274F";
            this._store.dispatch(WalletActions.changeChain({ chainId }));
        }

        await this._updateNftData();
    }

    private async _updateNftData() {
        const connected = await firstValueFrom(this.getIsConnected().pipe(filter(b => b === true)));
        if (connected) {
            const chainId = await firstValueFrom(this.getChainId());

            const balance = Number(await firstValueFrom(
                this._mm.call(
                    "balanceOf(address)", 
                    [{
                        arg: this._mm.getActiveAccount(false),
                        encode: false
                    }],
                    getNetwork(chainId).contracts.nft
                )
            ));

            if (balance > 0) {
                //TODO use alchemy to find our token-id
                const tokenId = 1;

                this._store.dispatch(WalletActions.setAccountNft({ nftId: tokenId }));
            }

        }
    }
}