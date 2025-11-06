import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AlchemyService } from '../alchemy/alchemy.service';
import { PriceActions } from './price.actions';
import { map, switchMap } from 'rxjs';

export const uponGetPrice = createEffect(
    (action$ = inject(Actions), alk = inject(AlchemyService)) =>
        action$.pipe(
            ofType(PriceActions.getPrice),
            switchMap(({ symbol }) =>
                alk.getSymbolPrice(symbol).pipe(
                    map((resp) => ({
                        symbol: resp.data[0].symbol,
                        price: resp.data[0].prices.filter((p) => p.currency === 'usd')[0].value,
                    })),
                ),
            ),
            map((symPrice) => PriceActions.getPriceSuccess(symPrice)),
        ),
    { functional: true, dispatch: true },
);
