import { Component, inject } from '@angular/core';
import { BuyCredits } from './buy-credits/buy-credits';
import { PriceFacade } from '../../store/price.facade';
import { WalletFacade } from '../../store/wallet.facade';
import { firstValueFrom, map, mergeMap, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChangeConstants } from '../../store/changes.constants';
import { SendCredits } from './send-credits/send-credits';
import { SendEth } from './send-eth/send-eth';

@Component({
    selector: 'app-send-tips',
    imports: [BuyCredits, AsyncPipe, SendCredits, SendEth],
    templateUrl: './send-tips.html',
    styleUrl: './send-tips.scss',
})
export class SendTips {
    private _priceFacade = inject(PriceFacade);
    private _walletFacade = inject(WalletFacade);

    pickedTips: string = 'credits';

    creditsBalance$ = this._walletFacade.getBalances().pipe(map(({ credits }) => credits));
    buyCreditsAllowance$ = this._walletFacade.getChainId().pipe(
        switchMap((chainId) =>
            this._priceFacade.getNativeTokenPrice(chainId).pipe(
                mergeMap((nativePriceUsd) =>
                    this._walletFacade
                        .getBalances()
                        .pipe(map(({ native }) => Math.floor((nativePriceUsd * native) / 0.1))),
                ),
            ),
        ),
    );
    creditsPurchasing$ = this._walletFacade.getChangePending(ChangeConstants.BUY_CREDITS);
    creditsSending$ = this._walletFacade.getChangePending(ChangeConstants.SEND_CREDITS);

    nativeBalance$ = this._walletFacade.getBalances().pipe(map(({ native }) => native));
    nativeSending$ = this._walletFacade.getChangePending(ChangeConstants.SEND_NATIVE);

    async buyCredits(amount: number) {
        const chainId = await firstValueFrom(this._walletFacade.getChainId());
        const nativeUsd = await firstValueFrom(this._priceFacade.getNativeTokenPrice(chainId));
        await this._walletFacade.buyCredits((amount * 0.1) / nativeUsd);
    }

    async sendCredits(data: { amount: number; to: number }) {
        await this._walletFacade.sendCredits(data.amount, data.to);
    }

    async sendNative(data: { amount: number; to: number }) {
        await this._walletFacade.sendNative(data.amount, data.to);
    }

    pickTips(picked: string) {
        this.pickedTips = picked;
    }
}
