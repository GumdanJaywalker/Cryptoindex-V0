-- Migration to increase wallet_address length for Solana support
-- Run this in your Supabase SQL editor

-- Update users table
ALTER TABLE users 
ALTER COLUMN wallet_address TYPE VARCHAR(64);

-- Update user_wallets table  
ALTER TABLE user_wallets 
ALTER COLUMN wallet_address TYPE VARCHAR(64);

-- Update indexes if needed
DROP INDEX IF EXISTS idx_users_wallet_address;
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

DROP INDEX IF EXISTS idx_user_wallets_address;
CREATE INDEX idx_user_wallets_address ON user_wallets(wallet_address);