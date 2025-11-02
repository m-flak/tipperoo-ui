import { Component, Input } from '@angular/core';
import { NetworkConstants } from '../../../blockchain/networks.constants';

@Component({
  selector: 'app-chain-icon',
  imports: [],
  templateUrl: './chain-icon.html',
  styleUrl: './chain-icon.scss',
})
export class ChainIcon {
  readonly chainIds = NetworkConstants;

  @Input()
  chainId = "0x0"
}
