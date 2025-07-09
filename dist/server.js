"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@/app"));
const logger_1 = require("@/utils/logger");
const database_1 = __importDefault(require("@/utils/database"));
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        const dbService = database_1.default.getInstance();
        const isDbHealthy = await dbService.healthCheck();
        if (!isDbHealthy) {
            throw new Error('Database connection failed');
        }
        logger_1.logger.info('Database connection established');
        const app = new app_1.default();
        const server = app.app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger_1.logger.info(`Health check: http://localhost:${PORT}/health`);
        });
        const gracefulShutdown = (signal) => {
            logger_1.logger.info(`Received ${signal}, shutting down gracefully`);
            server.close(() => {
                logger_1.logger.info('Server closed');
                process.exit(0);
            });
        };
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', { promise, reason });
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map