import { Injectable } from '@angular/core';
import { IWalletService } from '../../wallets/wallet-svc.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { getNetwork } from '../networks';
import { stripZeroX } from '../../wallets/metamask.utils';

@Injectable({
    providedIn: 'root',
})
export class NftService {
    balanceOf(wallet: IWalletService, account: string, chainId: string): Observable<number> {
        return wallet
            .call(
                'balanceOf(address)',
                [
                    {
                        arg: stripZeroX(account),
                        encode: false,
                    },
                ],
                getNetwork(chainId).contracts.nft,
            )
            .pipe(
                catchError(() => of(0)),
                map((result) => Number(result)),
            );
    }

    getAccountTokenId(wallet: IWalletService, account: string, chainId: string): Observable<number> {
        return wallet
            .call(
                'getAccountTokenId(address)',
                [
                    {
                        arg: stripZeroX(account),
                        encode: false,
                    },
                ],
                getNetwork(chainId).contracts.nft,
            )
            .pipe(
                catchError(() => of(0)), // 0 is no account nft
                map((result) => Number(result)),
            );
    }
}
