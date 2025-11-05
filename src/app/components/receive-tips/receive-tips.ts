import { Component, inject } from '@angular/core';
import { WalletFacade } from '../../store/wallet.facade';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChangeConstants } from '../../store/changes.constants';

@Component({
  selector: 'app-receive-tips',
  imports: [AsyncPipe],
  templateUrl: './receive-tips.html',
  styleUrl: './receive-tips.scss',
})
export class ReceiveTips {
  private _facade = inject(WalletFacade);

  hasAccount$ = this._facade.getNftAccountId().pipe(map(id => id > 0));
  accountCreating$ = this._facade.getChangePending(ChangeConstants.NEW_ACCOUNT);
  myBalance$ = this._facade.getBalances().pipe(map(({ credits}) => credits));
  accountId$ = this._facade.getNftAccountId();
  creditsRedeeming$ = this._facade.getChangePending(ChangeConstants.REDEEM_CREDITS);

  async createAccount() {
    await this._facade.createAccount();
  }

  async redeemCredits() {
    await this._facade.redeemCredits();
  }
}
