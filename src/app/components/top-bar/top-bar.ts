import { Component, inject } from '@angular/core';
import { ConnectWallet } from './connect-wallet/connect-wallet';
import { WalletFacade } from '../../store/wallet.facade';
import { map } from 'rxjs';
import { AssetSummary } from './asset-summary/asset-summary';
import { AsyncPipe } from '@angular/common';
import { getNetwork } from '../../blockchain/networks';

@Component({
    selector: 'app-top-bar',
    imports: [ConnectWallet, AssetSummary, AsyncPipe],
    templateUrl: './top-bar.html',
    styleUrl: './top-bar.scss',
})
export class TopBar {
    private _facade = inject(WalletFacade);

    connected$ = this._facade.getIsConnected();
    accountId$ = this._facade.getNftAccountId();
    hasAccount$ = this.accountId$.pipe(map((id) => id > 0));
    balances$ = this._facade.getBalances();
    activeNetwork$ = this._facade.getChainId().pipe(map((chainId) => getNetwork(chainId)));
}
