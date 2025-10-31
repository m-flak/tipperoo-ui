import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAccounts, selectChainId, selectIsConnected } from '../../store/wallet.selectors';
import { AsyncPipe } from '@angular/common';
import { WalletActions } from '../../store/wallet.actions';
import { ChainIcon } from '../chain-icon/chain-icon';

@Component({
  selector: 'app-connect-wallet',
  imports: [AsyncPipe, ChainIcon],
  templateUrl: './connect-wallet.html',
  styleUrl: './connect-wallet.scss',
})
export class ConnectWallet {
  private _store = inject(Store);
  
  connected$ = this._store.select(selectIsConnected);
  accounts$ = this._store.select(selectAccounts);
  chainId$ = this._store.select(selectChainId);

  constructor() {}
  
  connect() {
    this._store.dispatch(WalletActions.connect());
  }

  disconnect() {
    this._store.dispatch(WalletActions.disconnect());
  }

  switchNetwork() {
    console.log('switch network');
  }
}
