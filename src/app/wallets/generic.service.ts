import { from, map, Observable, tap, throwError } from 'rxjs';
import { AbstractWalletService } from './wallet-svc.abstract';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GenericWalletService extends AbstractWalletService {
    constructor() {
        super((<any>window).ethereum);
    }

    override getActiveAccount(prefix?: boolean): string {
        if (!this.ethereum) {
            this.ethereum = (<any>window).ethereum;

            if (!this.ethereum) {
                return '';
            }
        }

        const addr =
            (<any>this.ethereum)?.selectedAddress || (<any>this.ethereum)?.getSelectedAddress();

        if (prefix === false && addr) {
            return addr.replace('0x', '');
        }

        return addr || '';
    }

    override connectWallet(): Observable<string[]> {
        if (!this.ethereum) {
            this.ethereum = (<any>window).ethereum;

            if (!this.ethereum) {
                return throwError(() => new Error('No ethereum provider'));
            }
        }

        return from(
            this.ethereum.request({
                method: 'eth_requestAccounts',
            }),
        ).pipe(
            map((accounts) => <string[]>accounts),
            tap(() => (this.isConnected = true)),
        );
    }

    override disconnectWallet(): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.isConnected = false;
            subscriber.next();
            subscriber.complete();
        });
    }
}
