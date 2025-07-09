"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class DatabaseService {
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase configuration');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    getClient() {
        return this.supabase;
    }
    async healthCheck() {
        try {
            const { data, error } = await this.supabase
                .rpc('version');
            return !error;
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
}
exports.db = DatabaseService.getInstance().getClient();
exports.default = DatabaseService;
//# sourceMappingURL=database.js.map