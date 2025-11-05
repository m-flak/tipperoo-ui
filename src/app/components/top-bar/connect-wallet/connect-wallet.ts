import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAccounts, selectChainId, selectIsConnected } from '../../../store/wallet.selectors';
import { AsyncPipe } from '@angular/common';
import { WalletActions } from '../../../store/wallet.actions';
import { ChainIcon } from '../chain-icon/chain-icon';
import { firstValueFrom } from 'rxjs';
import { WalletFacade } from '../../../store/wallet.facade';
import { WalletAddressPipe } from './wallet-address.pipe';

@Component({
    selector: 'app-connect-wallet',
    imports: [AsyncPipe, ChainIcon, WalletAddressPipe],
    templateUrl: './connect-wallet.html',
    styleUrl: './connect-wallet.scss',
})
export class ConnectWallet {
    private _facade = inject(WalletFacade);

    connected$ = this._facade.getIsConnected();
    accounts$ = this._facade.getAccounts();
    chainId$ = this._facade.getChainId();

    constructor() {}

    async connect() {
        await this._facade.connectWallet();
    }

    disconnect() {
        this._facade.disconnectWallet();
    }

    async switchNetwork() {
        await this._facade.switchNetwork();
    }
}
