# Simple Route53 Dynamic DNS Cron 

This repository holds a simple express server that can be spun up to run the node module [simple-route53-ddns](https://github.com/pejulian/simple-route53-ddns) that will fetch the public IP address of the current network it is running on and update it in the relevant "A" record in Route53 for the specified AWS account.

## Usage

Fork the repository and create a `.env` file in the root directory with the following variables:

```bash
PORT=3000
HOSTED_ZONE_ID=Z01234567ABCDEFGH1XYZ
DOMAIN_NAME=nas.foo-bar.xyz
IAM_PROFILE=user-iam
REGION=ap-antartica-1
TTL=60
CRON_EXP=*/30 * * * *
```

_Remember to replace the sample values with actual values according to your setup_

`CRON_EXP` wil be used by `node-cron` to schedule a callback that invokes the script to update the record set in Route53 with the public IP address of the current network. Set it to an expression that [makes sense](https://crontab.guru/every-1-hour) and does not cause your IP to get banned. In the example above, the schedule is set to run once every 30 minutes of every day of the year.

> `CRON_EXP` must be a valid cron expression

> `DOMAIN_NAME` must be a valid FQDN that is being managed in a Hosted Zone on Route53

> `IAM_PROFILE` must be properly configured IAM User on your machine (configured via AWS CLI)

Understand more about these values by reading the [README](https://github.com/pejulian/simple-route53-ddns/blob/master/README.md) for the node module that this server will invoke.

Once everything is setup, make sure to build the script at least once to have the `dist` folder output:

```bash
npm run build
```

and then run 

```bash
node -r dotenv/config
```

or using `nodemon`:

```bash
nodemon -r dotenv/config
```