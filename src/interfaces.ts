export interface IEndpoints {
    latest: string,
}

export interface IRates {
    INR?: string,
    AUD?: string,
}

export interface IExchangeResponse {
    rates: IRates,
    base: string,
    date: string,
}
