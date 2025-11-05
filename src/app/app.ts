import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TopBar } from './components/top-bar/top-bar';
import { ReceiveTips } from "./components/receive-tips/receive-tips";
import { SendTips } from "./components/send-tips/send-tips";
import { WalletFacade } from './store/wallet.facade';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar, NgbAccordionModule, ReceiveTips, SendTips, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tipperoo-ui');

  private _facade = inject(WalletFacade);

  connected$ = this._facade.getIsConnected();
}
