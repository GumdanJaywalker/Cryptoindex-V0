-- Migration script to update database for Privy integration
-- This script preserves existing data while applying necessary changes

-- 1. Create the function to extract Privy user ID from JWT token
CREATE OR REPLACE FUNCTION get_privy_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Extract privy_user_id from JWT token's custom claims
  RETURN auth.jwt() ->> 'privy_user_id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure privy_user_id column exists in users table (safe operation)
ALTER TABLE users ADD COLUMN IF NOT EXISTS privy_user_id VARCHAR(255) UNIQUE;

-- 3. Create index on privy_user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_privy_user_id ON users(privy_user_id);

-- 4. Drop existing RLS policies (safe to drop and recreate)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can view own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can view own 2FA" ON user_2fa;

-- 5. Create new RLS policies using Privy context
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (get_privy_user_id() = privy_user_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (get_privy_user_id() = privy_user_id);

-- Only create wallet policies if user_wallets table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_wallets') THEN
    -- Drop existing wallet policies
    DROP POLICY IF EXISTS "Users can view own wallets" ON user_wallets;
    DROP POLICY IF EXISTS "Users can insert own wallets" ON user_wallets;
    DROP POLICY IF EXISTS "Users can update own wallets" ON user_wallets;
    DROP POLICY IF EXISTS "Users can delete own wallets" ON user_wallets;
    
    -- Create new wallet policies
    CREATE POLICY "Users can view own wallets" ON user_wallets
      FOR SELECT USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

    CREATE POLICY "Users can insert own wallets" ON user_wallets
      FOR INSERT WITH CHECK (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

    CREATE POLICY "Users can update own wallets" ON user_wallets
      FOR UPDATE USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

    CREATE POLICY "Users can delete own wallets" ON user_wallets
      FOR DELETE USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));
  END IF;
END $$;

-- 6. Drop unnecessary tables if they exist (preserving data by commenting out)
-- These tables will be dropped only if they exist and are empty or you confirm it's safe

-- Check if tables exist before dropping
DO $$
BEGIN
  -- Only drop if tables exist and you want to remove them
  -- Uncomment the lines below after confirming you want to drop these tables
  
  -- IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
  --   DROP TABLE user_sessions CASCADE;
  -- END IF;
  
  -- IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'email_verification_codes') THEN
  --   DROP TABLE email_verification_codes CASCADE;
  -- END IF;
  
  -- IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_2fa') THEN
  --   DROP TABLE user_2fa CASCADE;
  -- END IF;
  
  RAISE NOTICE 'Migration completed successfully. Tables preserved for safety.';
END $$;