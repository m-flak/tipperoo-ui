import { Observable } from "rxjs";
import { AbstractWalletService } from "./wallet-svc.abstract";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class GenericWalletService extends AbstractWalletService {
    private _connected = false;

    constructor() {
        super((<any>window).ethereum);
    }

    override get connected(): boolean {
       return this._connected;
    }

    override getActiveAccount(): string {
        throw new Error("Method not implemented.");
    }

    override connectWallet(): Observable<string[]> {
        throw new Error("Method not implemented.");
    }

    override disconnectWallet(): Observable<void> {
        throw new Error("Method not implemented.");
    }
    
}