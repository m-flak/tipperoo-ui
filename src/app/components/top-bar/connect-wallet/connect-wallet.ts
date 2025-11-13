import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { WalletFacade } from '../../../store/wallet.facade';
import { WalletAddressPipe } from './wallet-address.pipe';
import { ChainList } from '../chain-list/chain-list';

@Component({
    selector: 'app-connect-wallet',
    imports: [AsyncPipe, WalletAddressPipe, ChainList],
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
        this._facade.disconnectWallet(); // force popup
        await this._facade.connectWallet();
    }

    disconnect() {
        this._facade.disconnectWallet();
    }

    switchNetwork(id: string) {
        this._facade.switchNetwork(id);
    }
}
