import { Component, inject } from '@angular/core';
import { BuyCredits } from './buy-credits/buy-credits';
import { PriceFacade } from '../../store/price.facade';
import { WalletFacade } from '../../store/wallet.facade';
import { firstValueFrom, map, mergeMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChangeConstants } from '../../store/changes.constants';

@Component({
    selector: 'app-send-tips',
    imports: [BuyCredits, AsyncPipe],
    templateUrl: './send-tips.html',
    styleUrl: './send-tips.scss',
})
export class SendTips {
    private _priceFacade = inject(PriceFacade);
    private _walletFacade = inject(WalletFacade);

    // may need to swap order of observables
    buyCreditsAllowance$ = this._priceFacade
        .getEthereumPrice()
        .pipe(
            mergeMap((ethPriceUsd) =>
                this._walletFacade
                    .getBalances()
                    .pipe(map(({ eth }) => Math.floor((ethPriceUsd * eth) / 0.1))),
            ),
        );

    creditsPurchasing$ = this._walletFacade.getChangePending(ChangeConstants.BUY_CREDITS);

    async buyCredits(amount: number) {
        const ethUsd = await firstValueFrom(this._priceFacade.getEthereumPrice());
        await this._walletFacade.buyCredits((amount * 0.1) / ethUsd);
    }
}
