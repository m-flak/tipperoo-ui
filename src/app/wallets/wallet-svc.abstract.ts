import { Observable, throwError, from, filter, map, catchError, timer, switchMap, takeWhile } from "rxjs";
import { getNetwork } from "../blockchain/networks";
import { fnAbi, hexStr } from "./metamask.utils";
import { EIP1193Provider } from "eip1193-types";

declare type Maybe<Type> = Partial<Type> | null | undefined;

export abstract class AbstractWalletService {
    protected ethereum: EIP1193Provider | undefined;

    constructor(ethereum?: EIP1193Provider) {
        this.ethereum = ethereum;
    }

    abstract getActiveAccount(): string;

    abstract connectWallet(): Observable<string[]>;

    abstract disconnectWallet(): Observable<void>;

    getChainId(): Observable<string> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        return from(this.ethereum.request({ method: 'eth_chainId' })).pipe(
            filter((result) => result !== null || result !== undefined),
            map((result) => `${result}`),
        );
    }

    changeChain(chainId: string): Observable<string> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        const network = getNetwork(chainId);

        return from(
            this.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            }),
        ).pipe(
            catchError((err) => {
                if (err.code === 4902) {
                    return from(
                        this.ethereum!.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: network.chainId,
                                    chainName: network.name,
                                    rpcUrls: network.rpcUrls,
                                    nativeCurrency: network.nativeCurrency,
                                    blockExplorerUrls: network.blockExplorerUrls,
                                },
                            ],
                        }),
                    );
                }
                return throwError(() => new Error('Error changing chains!'));
            }),
            map(() => network.chainId),
        );
    }

    getBalance(address: string): Observable<number> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        return from(
            this.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            }),
        ).pipe(
            filter((n) => n !== null),
            map((n) => BigInt(<string>n)),
            map((big) => Number((big / 1n ** 18n).toString()) / 1e18),
        );
    }

    call(
        method: string,
        args: { arg: string | number; bytes?: number; encode?: boolean }[],
        to: string,
        sender?: string,
    ): Observable<string> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        let data = fnAbi(method);
        for (const arggg of args) {
            let { arg, bytes, encode } = arggg;
            bytes = bytes ?? 32;
            encode = encode ?? true;
            data += hexStr(arg, encode, 2 * bytes);
        }

        return from(
            this.ethereum!.request({
                method: 'eth_call',
                params: [
                    {
                        to,
                        from: sender,
                        data,
                    },
                ],
            }),
        ).pipe(map((result) => `${result}`));
    }

    transact(
        method: string,
        args: { arg: string | number; bytes?: number; encode?: boolean }[],
        to: string,
        sender: string,
        value?: bigint,
    ): Observable<string> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        let data = fnAbi(method);
        for (const arggg of args) {
            let { arg, bytes, encode } = arggg;
            bytes = bytes ?? 32;
            encode = encode ?? true;
            data += hexStr(arg, encode, 2 * bytes);
        }

        return from(
            this.ethereum!.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to,
                        from: sender,
                        data,
                        value: value ? '0x' + value.toString(16) : undefined,
                    },
                ],
            }),
        ).pipe(map((txHash) => <string>txHash));
    }

    receipt(
        txHash: string,
    ): Observable<Partial<{ transactionHash: string; status: string }> | null | undefined> {
        if (!this.ethereum) {
            return throwError(() => new Error('No ethereum provider'));
        }

        return timer(2000).pipe(
            switchMap(() =>
                from(
                    <Promise<Maybe<unknown>>>this.ethereum!.request({
                        method: 'eth_getTransactionReceipt',
                        params: [txHash],
                    }),
                ),
            ),
            takeWhile((tx) => tx === null || tx === undefined, true),
        );
    }
}