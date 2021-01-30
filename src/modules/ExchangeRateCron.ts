import SMTPConnection from "nodemailer/lib/smtp-connection";
import dotenv from 'dotenv';
import { IExchangeResponse } from "../interfaces";
import ExchangeRequest from "./ExchangeRequest";
import Constants from "../Constants";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from 'nodemailer';

dotenv.config();

class ExchangeRateCron {
    
    public get host() : string {
        return process.env.HOST!;
    }

    
    public get port() : string {
        return process.env.PORT!;
    }

    
    public get secure() : boolean {
        return Boolean(process.env.SECURE!);
    }

    
    public get service() : string {
        return process.env.SERVICE!;
    }

    
    public get user() : string {
        return process.env.AUTH_USER!;
    }

    
    public get pass() : string {
        return process.env.AUTH_PASS!;
    }
    
    
    public get auth() : SMTPConnection.AuthenticationType {
        return {
            user: this.user,
            pass: this.pass,
        }
    }

    async getExchangeResponse(): Promise<IExchangeResponse> {
        console.log('Attempting to fetch the exchange rate...');
        const exchangeRequest: ExchangeRequest = new ExchangeRequest();

        const exchangeResponse: IExchangeResponse = await exchangeRequest.fetchExchangeResponse();

        console.log('Attempt to fetch exchange rate completed!');
        
        return exchangeResponse;
    }

    getMailTransporter(): Mail {
        return nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: process.env.SECURE,
            service: process.env.SERVICE,
            auth:  {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS,
            },
            logger: true,
        } as SMTPTransport.Options);
    }

    async execute(): Promise<boolean> {
        const { base, date, rates } = await this.getExchangeResponse();

        const { INR } = rates;

        const { exchangeRateThreshold, RATES } = Constants;

        const {INR: to} = RATES;

        let mailerFlag = false;

        if (parseFloat(INR!) >= exchangeRateThreshold) {
            console.log('Exchange rate is above threshold! Setting up resources to send email..')
            const mailTransporter: Mail = this.getMailTransporter();

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
            console.log('Sending email..');
            try {
                await mailTransporter.sendMail({
                    from: process.env.FROM,
                    to: process.env.TO,
                    subject: 'Exchange rate has crossed threshold!',
                    html
                } as Mail.Options)
                console.log('Email sent successfully!');
            } catch (error) {
                console.log(`Error sending email! Details: ${error}`);
            }
            mailerFlag = true;
        }
        else console.log('Exchange rate is below the specified threshold!');

        return mailerFlag;
    }
}

export default ExchangeRateCron;