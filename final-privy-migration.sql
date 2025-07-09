-- Final Privy Migration Script
-- Run this in your Supabase SQL Editor Dashboard

-- 1. Create the Privy user ID extraction function
CREATE OR REPLACE FUNCTION get_privy_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Extract privy_user_id from JWT token's custom claims
  RETURN auth.jwt() ->> 'privy_user_id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure users table has the right structure for Privy
ALTER TABLE users ADD COLUMN IF NOT EXISTS privy_user_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_type VARCHAR(10) CHECK (auth_type IN ('email', 'wallet'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(42) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_type VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Add constraints for proper auth type handling
ALTER TABLE users DROP CONSTRAINT IF EXISTS email_required_for_email_auth;
ALTER TABLE users DROP CONSTRAINT IF EXISTS wallet_required_for_wallet_auth;

ALTER TABLE users ADD CONSTRAINT email_required_for_email_auth 
  CHECK ((auth_type = 'email' AND email IS NOT NULL) OR auth_type != 'email');
ALTER TABLE users ADD CONSTRAINT wallet_required_for_wallet_auth 
  CHECK ((auth_type = 'wallet' AND wallet_address IS NOT NULL) OR auth_type != 'wallet');

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_privy_user_id ON users(privy_user_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_type ON users(auth_type);

-- 5. Update user_wallets table structure
ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT;
ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS wallet_provider VARCHAR(20) DEFAULT 'privy';
ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT TRUE;
ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 6. Create indexes for user_wallets
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON user_wallets(wallet_address);

-- 7. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies and create new Privy-based ones
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can insert own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can update own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can delete own wallets" ON user_wallets;

-- 9. Create new RLS policies using Privy context
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (get_privy_user_id() = privy_user_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (get_privy_user_id() = privy_user_id);

CREATE POLICY "Users can view own wallets" ON user_wallets
  FOR SELECT USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can insert own wallets" ON user_wallets
  FOR INSERT WITH CHECK (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can update own wallets" ON user_wallets
  FOR UPDATE USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

CREATE POLICY "Users can delete own wallets" ON user_wallets
  FOR DELETE USING (get_privy_user_id() = (SELECT privy_user_id FROM users WHERE id = user_id));

-- 10. Final verification
SELECT 'PRIVY MIGRATION COMPLETED' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;