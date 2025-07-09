import { SupabaseClient } from '@supabase/supabase-js';
declare class DatabaseService {
    private static instance;
    private supabase;
    private constructor();
    static getInstance(): DatabaseService;
    getClient(): SupabaseClient;
    healthCheck(): Promise<boolean>;
}
export declare const db: SupabaseClient<any, "public", any>;
export default DatabaseService;
//# sourceMappingURL=database.d.ts.map