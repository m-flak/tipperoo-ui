import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PricesResponse } from './prices.model';

const API_KEY = import.meta.env.NG_APP_ALCHEMY_API_KEY;

@Injectable({
    providedIn: 'root',
})
export class AlchemyService {
    constructor(private _http: HttpClient) {}

    getSymbolPrice(symbol: string): Observable<PricesResponse> {
        return this._http.get<PricesResponse>(
            `https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=${symbol}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
                observe: 'body',
            },
        );
    }
}
