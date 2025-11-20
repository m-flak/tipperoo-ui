import { Component, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TopBar } from './components/top-bar/top-bar';
import { ReceiveTips } from './components/receive-tips/receive-tips';
import { SendTips } from './components/send-tips/send-tips';
import { WalletFacade } from './store/wallet.facade';
import { AsyncPipe } from '@angular/common';
import { PriceFacade } from './store/price.facade';

// lol
let instance: App | null = null;

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TopBar, NgbAccordionModule, ReceiveTips, SendTips, AsyncPipe],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
    protected readonly title = signal('tipperoo-ui');

    private _zone = inject(NgZone);
    private _facade = inject(WalletFacade);
    private _facadePrice = inject(PriceFacade);

    connected$ = this._facade.getIsConnected();

    ngOnInit(): void {
        this._zone.runOutsideAngular(() => {
            // because `this` will be `window` in the event listener
            instance = this;
            window.addEventListener('eip6963:announceProvider', this.onAnnounce);
        });

        this._facade.disconnectWallet(); //force popup
        this._facadePrice.getPrices();
    }

    ngOnDestroy(): void {
        window.removeEventListener('eip6963:announceProvider', this.onAnnounce);
    }

    onAnnounce(event: any) {
        instance?._zone.run(() => {
            instance?._facade.addWalletProvider(event.detail.info);
        });
    }
}
