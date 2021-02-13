import { IEndpoints, IRates } from "./interfaces";

class Constants {
    static readonly EXCHANGE_RATE_BASE_URL: string = 'https://api.exchangeratesapi.io/';
    static readonly ENDPOINT: IEndpoints = {
        latest: 'latest/',
    }
    static readonly RATES: IRates = {
        INR: 'INR',
        AUD: 'AUD',
    };
    static readonly exchangeRateThreshold: number = 57;
}

export default Constants;
