import ExchangeRateCron from "./modules/ExchangeRateCron";
import moment from 'moment';

const getCurrentMoment = () => moment().format('DD/MM/YYYY, hh:mm:ss A');

async function main(): Promise<boolean> {
    console.log(`********** Start - ${getCurrentMoment()} **********`);
    const exchangeRateCron = new ExchangeRateCron();
    const mailerFlag: boolean = await exchangeRateCron.execute();
    console.log(`********** End - ${getCurrentMoment()} **********`);
    return mailerFlag;
}

const pollHandler = setInterval(async () => {
    const mailerFlag: boolean = await main();
    if (mailerFlag) {
        clearInterval(pollHandler);
        console.log(`\n\n========== Cron ended at ${getCurrentMoment()} ==========\n\n`);
    }
}, Number(process.env.INTERVAL));

console.log(`========== Cron started at ${getCurrentMoment()} ==========\n\n`);
