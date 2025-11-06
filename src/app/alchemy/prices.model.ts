export interface Price {
    currency: string;
    value: string;
    lastUpdatedAt: string;
}

export interface PriceData {
    symbol: string;
    prices: Price[];
    error?: string;
}

export interface PricesResponse {
    data: PriceData[];
}
