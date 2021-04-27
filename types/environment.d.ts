export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly PORT: string | undefined;
            readonly HOSTED_ZONE_ID: string | undefined;
            readonly DOMAIN_NAME: string | undefined;
            readonly IAM_PROFILE: string | undefined;
            readonly REGION: string | undefined;
            readonly TTL: string | undefined;
            readonly CRON_EXP: string | undefined;
        }
    }
}
