import ExchangeRequest from './modules/ExchangeRequest';
import { IExchangeResponse } from './interfaces';
import nodemailer from 'nodemailer';
import Constants from './Constants';
import dotenv from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

dotenv.config();

async function main() {

    const exchangeRequest: ExchangeRequest = new ExchangeRequest();

    const exchangeResponse: IExchangeResponse = await exchangeRequest.fetchExchangeResponse();
    
    const { base, date, rates } = exchangeResponse;

    const { INR } = rates;

    const { exchangeRateThreshold, RATES } = Constants;

    const {INR: to} = RATES;

    if (parseFloat(INR!) >= exchangeRateThreshold) {

        const mailTransporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: process.env.SECURE,
            service: process.env.SERVICE,
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS,
            },
            logger: true,
        } as SMTPTransport.Options);

        const html: string = `
            <table border="1">
                <tr>
                    <td>From</td>
                    <td>${base}</td>
                </tr>
                <tr>
                    <td>To</td>
                    <td>${to}</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>${date}</td>
                </tr>
                <tr>
                    <td>Rate</td>
                    <td>${INR}</td>
                </tr>
            </table>
        `;

        await mailTransporter.sendMail({
            from: process.env.FROM,
            to: process.env.TO,
            subject: 'Exchange rate has crossed threshold!',
            html
        } as Mail.Options)
    }
}

main();