import { inject, Injectable } from '@angular/core';
import { MetaMaskService } from '../../metamask/metamask.service';
import { catchError, map, Observable, of } from 'rxjs';
import { getNetwork } from '../networks';
import { stripZeroX } from '../../metamask/metamask.utils';

@Injectable({
    providedIn: 'root',
})
export class NftService {
    private _mm = inject(MetaMaskService);

    balanceOf(account: string, chainId: string): Observable<number> {
        return this._mm
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

    getAccountTokenId(account: string, chainId: string): Observable<number> {
        return this._mm
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
