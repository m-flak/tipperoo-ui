import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PriceActions } from './price.actions';
import { selectPrice } from './price.selectors';

@Injectable({
    providedIn: 'root',
})
export class PriceFacade {
    private _store = inject(Store);

    constructor() {}

    getEthereumPrice = () => this._store.select(selectPrice('ETH'));

    getPrices() {
        this._store.dispatch(PriceActions.getPrice({ symbol: 'ETH' }));
    }
}
