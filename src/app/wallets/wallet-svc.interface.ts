import { Observable } from "rxjs";

export interface CallArg {
    arg: string | number;
    bytes?: number;
    encode?: boolean;
}

export interface IWalletService {
    readonly connected: boolean;

    getActiveAccount(): string;

    connectWallet(): Observable<string[]>;

    disconnectWallet(): Observable<void>;

    getChainId(): Observable<string>;

    changeChain(chainId: string): Observable<string>;

    getBalance(address: string): Observable<number>;

    call(method: string, args: CallArg[], to: string, sender?: string): Observable<string>;

    transact(method: string, args: CallArg[], to: string, sender: string, value?: bigint): Observable<string>;

    receipt(txHash: string): Observable<Partial<{ transactionHash: string; status: string }> | null | undefined>;
}
