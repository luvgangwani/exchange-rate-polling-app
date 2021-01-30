import Constants from '../Constants';
import axios from 'axios';
import { IExchangeResponse } from '../interfaces';

class ExchangeRequest {

    async fetchExchangeResponse(): Promise<IExchangeResponse> {
        const { EXCHANGE_RATE_BASE_URL, ENDPOINT, RATES } = Constants;
        const { latest } = ENDPOINT;
        const { INR, AUD } = RATES;
        try {
            console.log('Initiating exchange rate request...');
            const response = await axios.get(
                `${EXCHANGE_RATE_BASE_URL}${latest}`, {
                params: {
                    base: AUD,
                    symbols: [INR].join(','),
                }
            });
            console.log('Exchange rate response fetched successfully!');
            return response.data;
        }
        catch (error) {
            console.log('Error fetching exchange rate response!');
            return error;
        } 
    }
}

export default ExchangeRequest;
