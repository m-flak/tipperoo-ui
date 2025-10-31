import { Component } from '@angular/core';
import { ConnectWallet } from '../connect-wallet/connect-wallet';

@Component({
  selector: 'app-top-bar',
  imports: [ConnectWallet],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {

}
