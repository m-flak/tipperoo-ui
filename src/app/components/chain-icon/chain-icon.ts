import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chain-icon',
  imports: [],
  templateUrl: './chain-icon.html',
  styleUrl: './chain-icon.scss',
})
export class ChainIcon {
  @Input()
  chainId = "0x0"
}
