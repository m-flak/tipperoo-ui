import { createFeature, createReducer, on } from '@ngrx/store';
import { PriceActions } from './price.actions';

export interface PriceState {
    prices: Record<string, number>;
}

export const priceState: PriceState = {
    prices: {},
};

export const priceReducer = createReducer(
    priceState,
    on(PriceActions.getPriceSuccess, (state, { symbol, price }) => {
        let prices = { ...state.prices };
        prices[symbol] = Number(price);
        return {
            ...state,
            prices,
        };
    }),
);

export const priceFeature = createFeature({
    name: 'price',
    reducer: priceReducer,
});
