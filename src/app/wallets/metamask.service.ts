import { Inject, Injectable } from '@angular/core';
import { METAMASK } from './metamask.provider';
import MetaMaskSDK, { SDKProvider } from '@metamask/sdk';
import {
    catchError,
    exhaustMap,
    filter,
    from,
    map,
    Observable,
    switchMap,
    takeUntil,
    takeWhile,
    tap,
    throwError,
    timer,
} from 'rxjs';
import { getNetwork } from '../blockchain/networks';
import { fnAbi, hexStr } from './metamask.utils';
import { AbstractWalletService } from './wallet-svc.abstract';

@Injectable({
    providedIn: 'root',
})
export class MetaMaskService extends AbstractWalletService {
    private _ethereum: SDKProvider | undefined = undefined;

    constructor(@Inject(METAMASK) private _mm: MetaMaskSDK) {
        super();
    }

    override get connected() {
        return this._ethereum !== undefined;
    }

    override getActiveAccount(prefix?: boolean): string {
        let addr = this._ethereum?.getSelectedAddress();

        if (!addr) {
            addr = hexStr(0, true, 40, prefix ? '0x' : '');
        } else if (prefix === false) {
            addr = addr.replace('0x', '');
        }

        return addr;
    }

    override connectWallet(): Observable<string[]> {
        return from(this._mm.connect()).pipe(
            tap(() => {
                this._ethereum = this._mm.getProvider();
                this.ethereum = <any>this._ethereum;
            }),
        );
    }

    override disconnectWallet(): Observable<void> {
        return from(this._mm.terminate()).pipe(
            tap(() => {
                this._ethereum = undefined;
                this.ethereum = undefined;
            }),
        );
    }
}
