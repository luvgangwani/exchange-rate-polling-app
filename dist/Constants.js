"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.EXCHANGE_RATE_BASE_URL = 'https://api.exchangeratesapi.io/';
    Constants.ENDPOINT = {
        latest: 'latest/',
    };
    Constants.RATES = {
        INR: 'INR',
        AUD: 'AUD',
    };
    Constants.exchangeRateThreshold = 56;
    return Constants;
}());
exports.default = Constants;
