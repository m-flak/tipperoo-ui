import { Component, inject } from '@angular/core';
import { BuyCredits } from './buy-credits/buy-credits';
import { PriceFacade } from '../../store/price.facade';
import { WalletFacade } from '../../store/wallet.facade';
import { firstValueFrom, map, mergeMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChangeConstants } from '../../store/changes.constants';
import { SendCredits } from './send-credits/send-credits';

@Component({
    selector: 'app-send-tips',
    imports: [BuyCredits, AsyncPipe, SendCredits],
    templateUrl: './send-tips.html',
    styleUrl: './send-tips.scss',
})
export class SendTips {
    private _priceFacade = inject(PriceFacade);
    private _walletFacade = inject(WalletFacade);

    creditsBalance$ = this._walletFacade.getBalances().pipe(map(({ credits }) => credits));
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
    creditsSending$ = this._walletFacade.getChangePending(ChangeConstants.SEND_CREDITS);

    async buyCredits(amount: number) {
        const ethUsd = await firstValueFrom(this._priceFacade.getEthereumPrice());
        await this._walletFacade.buyCredits((amount * 0.1) / ethUsd);
    }

    async sendCredits(data: { amount: number; to: number }) {
        await this._walletFacade.sendCredits(data.amount, data.to);
    }
}
