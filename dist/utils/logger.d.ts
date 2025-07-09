import { Request, Response, NextFunction } from 'express';
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
declare class Logger {
    private static instance;
    private logLevel;
    private constructor();
    static getInstance(): Logger;
    private shouldLog;
    private formatMessage;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
export declare const logger: Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=logger.d.ts.map