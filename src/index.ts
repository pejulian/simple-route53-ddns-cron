import express from 'express';
import * as cron from 'node-cron';
import chalk from 'chalk';
import dotenv from 'dotenv';
import shelljs from 'shelljs';

dotenv.config();

const app = express();

let task: cron.ScheduledTask;

const server = app.listen(1337, () => {
    console.log(chalk.bgGreenBright(`Server running on port 1337`));

    if (
        typeof process.env.CRON_EXP === 'undefined' ||
        process.env.CRON_EXP.length === 0
    ) {
        console.log(chalk.redBright(`process.env.CRON_EXP is undefined`));
        server.close();
        return;
    }

    if (!cron.validate(process.env.CRON_EXP)) {
        console.log(
            chalk.redBright(
                `The cron expression ${process.env.CRON_EXP} is invalid`
            )
        );
        server.close();
        return;
    }

    if (
        typeof process.env.HOSTED_ZONE_ID === 'undefined' ||
        process.env.HOSTED_ZONE_ID.length === 0
    ) {
        console.log(
            chalk.redBright(
                `process.env.HOSTED_ZONE_ID is undefined... this script requires a valid HostedZone in AWS Route53 to work`
            )
        );
        server.close();
        return;
    }

    if (
        typeof process.env.DOMAIN_NAME === 'undefined' ||
        process.env.DOMAIN_NAME.length === 0
    ) {
        console.log(
            chalk.redBright(
                `process.env.DOMAIN_NAME is undefined... this script requires a valid FQDN to which the public ip of this network will be mapped`
            )
        );
        server.close();
        return;
    }

    if (
        typeof process.env.IAM_PROFILE === 'undefined' ||
        process.env.IAM_PROFILE.length === 0
    ) {
        console.log(
            chalk.redBright(
                `process.env.IAM_PROFILE is undefined.. this script requires an explicit IAM profile to run`
            )
        );
        server.close();
        return;
    }

    if (
        typeof process.env.REGION === 'undefined' ||
        process.env.REGION.length === 0
    ) {
        console.log(
            chalk.yellowBright(
                `process.env.REGION is undefined.. script will default profile to ap-southeast-1`
            )
        );
    }

    try {
        task = cron.schedule(process.env.CRON_EXP, () => {
            console.log(`Running simple-route53-ddns module`);

            try {
                shelljs.exec(
                    `npm run simple-route53-ddns -- update-record-set -h ${
                        process.env.HOSTED_ZONE_ID
                    } -d ${process.env.DOMAIN_NAME} -p ${
                        process.env.IAM_PROFILE
                    } -r ${process.env.REGION ?? `ap-southeast-1`}`
                );
            } catch (e) {
                console.log(
                    chalk.bgRedBright(
                        'An error occured while executing the simple-route53-ddns module with given arguments'
                    ),
                    e
                );
            }
        });

        task.start();

        console.log(chalk.cyanBright(`Task has been scheduled`));
    } catch (e) {
        console.log(
            chalk.bgRedBright(
                `An error occured when attempting to schedule a cron with expression ${process.env.CRON_EXP}`
            ),
            e
        );
    }
});

const shutDown = () => {
    server.close(() => {
        if (typeof task !== 'undefined') {
            console.log(chalk.grey('Terminating cron task'));
            task.stop();
        }
        process.exit(0);
    });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
