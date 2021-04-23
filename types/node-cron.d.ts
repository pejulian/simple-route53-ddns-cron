declare module 'node-cron' {
    export interface ScheduledTask {
        readonly start: () => void;
        readonly stop: () => void;
    }

    export interface BackgroundScheduledTask {
        readonly start: () => void;
        readonly stop: () => void;
        readonly pid: () => string;
        readonly isRuning: () => boolean;
    }

    export interface ScheduleOptions {
        readonly scheduled: boolean;
        readonly timezone: string;
    }

    export function schedule<T>(
        expression: string,
        fn: T,
        options?: ScheduleOptions
    ): T extends () => void ? ScheduledTask : BackgroundScheduledTask;

    export function validate(expression: string): boolean;
}
