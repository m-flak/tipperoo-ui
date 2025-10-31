import { Inject, Injectable } from "@angular/core";
import { METAMASK } from "./metamask.provider";
import MetaMaskSDK, { SDKProvider } from "@metamask/sdk";
import { filter, from, map, Observable, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MetaMaskService {
    private _ethereum: SDKProvider | undefined = undefined;

    constructor(@Inject(METAMASK) private _mm: MetaMaskSDK) {}

    connectWallet(): Observable<string[]> {
        return from(this._mm.connect()).pipe(
            tap(() => {
                this._ethereum = this._mm.getProvider();
            })
        );
    }

    disconnectWallet(): Observable<void> {
        return from(this._mm.terminate()).pipe(
            tap(() => {
                this._ethereum = undefined;
            })
        );
    }

    getChainId(): Observable<string> {
        if (!this._ethereum) {
            return throwError(() => new Error("No ethereum provider"));
        }

        return from(this._ethereum.request({method: "eth_chainId"})).pipe(
            filter(result => result !== null || result !== undefined),
            map(result => String(result))
        )
    }
}
