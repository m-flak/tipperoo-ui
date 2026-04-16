import { Component, inject, Input, TemplateRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { WalletFacade } from '../../../store/wallet.facade';
import { WalletAddressPipe } from './wallet-address.pipe';
import { ChainList } from '../chain-list/chain-list';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-connect-wallet',
    imports: [AsyncPipe, WalletAddressPipe, ChainList],
    templateUrl: './connect-wallet.html',
    styleUrl: './connect-wallet.scss',
})
export class ConnectWallet {
    private _modal = inject(NgbModal);
    private _facade = inject(WalletFacade);

    connected$ = this._facade.getIsConnected();
    accounts$ = this._facade.getAccounts();
    chainId$ = this._facade.getChainId();

    walletProviders$ = this._facade.getWalletProviders();

    constructor() {}

    async connect(providerName: string) {
        this._facade.disconnectWallet(); // force popup
        await this._facade.connectWallet(providerName);
    }

    disconnect() {
        this._facade.disconnectWallet();
    }

    switchNetwork(id: string) {
        this._facade.switchNetwork(id);
    }

    openModal(content: TemplateRef<any>) {
        this._modal.open(content, { centered: true });
    }
}
