"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("@/utils/logger");
dotenv_1.default.config();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
            message: {
                success: false,
                error: 'Too many requests from this IP, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use(limiter);
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(logger_1.requestLogger);
    }
    initializeRoutes() {
        this.app.get('/health', (req, res) => {
            const response = {
                success: true,
                data: {
                    status: 'OK',
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime()
                }
            };
            res.status(200).json(response);
        });
        this.app.use('*', (req, res) => {
            const response = {
                success: false,
                error: `Route ${req.originalUrl} not found`
            };
            res.status(404).json(response);
        });
    }
    initializeErrorHandling() {
        this.app.use((error, req, res, next) => {
            logger_1.logger.error('Unhandled error:', {
                error: error.message,
                stack: error.stack,
                url: req.originalUrl,
                method: req.method
            });
            const response = {
                success: false,
                error: process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : error.message
            };
            res.status(500).json(response);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map