import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TopBar } from './components/top-bar/top-bar';
import { ReceiveTips } from './components/receive-tips/receive-tips';
import { SendTips } from './components/send-tips/send-tips';
import { WalletFacade } from './store/wallet.facade';
import { AsyncPipe } from '@angular/common';
import { PriceFacade } from './store/price.facade';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopBar, NgbAccordionModule, ReceiveTips, SendTips, AsyncPipe],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit {
    protected readonly title = signal('tipperoo-ui');

    private _facade = inject(WalletFacade);
    private _facadePrice = inject(PriceFacade);

    connected$ = this._facade.getIsConnected();

    ngOnInit(): void {
        this._facade.disconnectWallet(); //force popup
        this._facadePrice.getPrices();
    }
}
