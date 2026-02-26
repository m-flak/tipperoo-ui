import { inject, Injectable } from '@angular/core';
import { MetaMaskService } from '../../wallets/metamask.service';
import { catchError, map, Observable, of } from 'rxjs';
import { getNetwork } from '../networks';
import { stripZeroX } from '../../wallets/metamask.utils';

@Injectable({
    providedIn: 'root',
})
export class CreditsManagerService {
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
                getNetwork(chainId).contracts.creditsMgr,
            )
            .pipe(
                catchError(() => of(0)),
                map((result) => Number(result)),
            );
    }
}
