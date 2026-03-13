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

    override getActiveAccount(prefix: boolean = true): string {
        let addr = this._ethereum?.getSelectedAddress();

        if (!addr) {
            addr = hexStr(0, true, 40, prefix ? '0x' : '');
        } else if (!prefix) {
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

    // getChainId(): Observable<string> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     return from(this._ethereum.request({ method: 'eth_chainId' })).pipe(
    //         filter((result) => result !== null || result !== undefined),
    //         map((result) => `${result}`),
    //     );
    // }

    // changeChain(chainId: string): Observable<string> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     const network = getNetwork(chainId);

    //     return from(
    //         this._ethereum.request({
    //             method: 'wallet_switchEthereumChain',
    //             params: [{ chainId }],
    //         }),
    //     ).pipe(
    //         catchError((err) => {
    //             if (err.code === 4902) {
    //                 return from(
    //                     this._ethereum!.request({
    //                         method: 'wallet_addEthereumChain',
    //                         params: [
    //                             {
    //                                 chainId: network.chainId,
    //                                 chainName: network.name,
    //                                 rpcUrls: network.rpcUrls,
    //                                 nativeCurrency: network.nativeCurrency,
    //                                 blockExplorerUrls: network.blockExplorerUrls,
    //                             },
    //                         ],
    //                     }),
    //                 );
    //             }
    //             return throwError(() => new Error('Error changing chains!'));
    //         }),
    //         map(() => network.chainId),
    //     );
    // }

    // getBalance(address: string): Observable<number> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     return from(
    //         this._ethereum.request({
    //             method: 'eth_getBalance',
    //             params: [address, 'latest'],
    //         }),
    //     ).pipe(
    //         filter((n) => n !== null),
    //         map((n) => BigInt(<string>n)),
    //         map((big) => Number((big / 1n ** 18n).toString()) / 1e18),
    //     );
    // }

    // call(
    //     method: string,
    //     args: { arg: string | number; bytes?: number; encode?: boolean }[],
    //     to: string,
    //     sender?: string,
    // ): Observable<string> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     let data = fnAbi(method);
    //     for (const arggg of args) {
    //         let { arg, bytes, encode } = arggg;
    //         bytes = bytes ?? 32;
    //         encode = encode ?? true;
    //         data += hexStr(arg, encode, 2 * bytes);
    //     }

    //     return from(
    //         this._ethereum!.request({
    //             method: 'eth_call',
    //             params: [
    //                 {
    //                     to,
    //                     from: sender,
    //                     data,
    //                 },
    //             ],
    //         }),
    //     ).pipe(map((result) => `${result}`));
    // }

    // transact(
    //     method: string,
    //     args: { arg: string | number; bytes?: number; encode?: boolean }[],
    //     to: string,
    //     sender: string,
    //     value?: bigint,
    // ): Observable<string> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     let data = fnAbi(method);
    //     for (const arggg of args) {
    //         let { arg, bytes, encode } = arggg;
    //         bytes = bytes ?? 32;
    //         encode = encode ?? true;
    //         data += hexStr(arg, encode, 2 * bytes);
    //     }

    //     return from(
    //         this._ethereum!.request({
    //             method: 'eth_sendTransaction',
    //             params: [
    //                 {
    //                     to,
    //                     from: sender,
    //                     data,
    //                     value: value ? '0x' + value.toString(16) : undefined,
    //                 },
    //             ],
    //         }),
    //     ).pipe(map((txHash) => <string>txHash));
    // }

    // receipt(
    //     txHash: string,
    // ): Observable<Partial<{ transactionHash: string; status: string }> | null | undefined> {
    //     if (!this._ethereum) {
    //         return throwError(() => new Error('No ethereum provider'));
    //     }

    //     return timer(2000).pipe(
    //         switchMap(() =>
    //             from(
    //                 this._ethereum!.request({
    //                     method: 'eth_getTransactionReceipt',
    //                     params: [txHash],
    //                 }),
    //             ),
    //         ),
    //         takeWhile((tx) => tx === null || tx === undefined, true),
    //     );
    // }
}
