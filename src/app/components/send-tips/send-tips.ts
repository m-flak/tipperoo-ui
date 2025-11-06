import { Component, inject } from '@angular/core';
import { BuyCredits } from './buy-credits/buy-credits';
import { PriceFacade } from '../../store/price.facade';
import { WalletFacade } from '../../store/wallet.facade';
import { map, mergeMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-send-tips',
    imports: [BuyCredits, AsyncPipe],
    templateUrl: './send-tips.html',
    styleUrl: './send-tips.scss',
})
export class SendTips {
    private _priceFacade = inject(PriceFacade);
    private _walletFacade = inject(WalletFacade);

    buyCreditsAllowance$ = this._priceFacade
        .getEthereumPrice()
        .pipe(
            mergeMap((ethPriceUsd) =>
                this._walletFacade
                    .getBalances()
                    .pipe(map(({ eth }) => Math.floor((ethPriceUsd * eth) / 0.1))),
            ),
        );
}
