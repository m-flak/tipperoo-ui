import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PriceActions } from './price.actions';
import { selectPrice } from './price.selectors';
import { getNetwork } from '../blockchain/networks';

@Injectable({
    providedIn: 'root',
})
export class PriceFacade {
    private _store = inject(Store);

    constructor() {}

    getNativeTokenPrice = (chainId: string) =>
        this._store.select(selectPrice(getNetwork(chainId).nativeCurrency.symbol));

    getPrices(chainId: string) {
        const symbol = getNetwork(chainId).nativeCurrency.symbol;
        this._store.dispatch(PriceActions.getPrice({ symbol }));
    }
}
