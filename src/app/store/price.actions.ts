import { createActionGroup, props } from '@ngrx/store';

export const PriceActions = createActionGroup({
    source: 'Price',
    events: {
        'Get Price': props<{ symbol: string }>(),
        'Get Price Success': props<{ symbol: string; price: string }>(),
    },
});
