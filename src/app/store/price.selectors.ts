import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PriceState } from './price.reducer';

export const selectPrices = createFeatureSelector<PriceState>('price');

export const selectPrice = (symbol: string) =>
    createSelector(selectPrices, (state) => state.prices[symbol]);
