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

  async createAccount() {
    await this._facade.createAccount();
  }
}
