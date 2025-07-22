-- Create trading system tables
-- Migration: 20250722_create_trading_system_tables.sql

-- ==========================================
-- TRADING ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS trading_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_address VARCHAR(42) NOT NULL,
    order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('market', 'limit')),
    side VARCHAR(4) NOT NULL CHECK (side IN ('buy', 'sell')),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    price DECIMAL(20,8) CHECK (price > 0), -- nullable for market orders
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled', 'partial')),
    hypercore_order_id VARCHAR(100), -- HyperCore에서 반환된 주문 ID
    filled_amount DECIMAL(20,8) DEFAULT 0,
    remaining_amount DECIMAL(20,8),
    average_fill_price DECIMAL(20,8),
    transaction_hash VARCHAR(66), -- Ethereum tx hash
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    filled_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for trading_orders
CREATE INDEX idx_trading_orders_user_id ON trading_orders(user_id);
CREATE INDEX idx_trading_orders_token_address ON trading_orders(token_address);
CREATE INDEX idx_trading_orders_status ON trading_orders(status);
CREATE INDEX idx_trading_orders_created_at ON trading_orders(created_at DESC);
CREATE INDEX idx_trading_orders_hypercore_id ON trading_orders(hypercore_order_id);

-- ==========================================
-- TRADING POSITIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS trading_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_address VARCHAR(42) NOT NULL,
    symbol VARCHAR(20), -- Token symbol for display
    amount DECIMAL(20,8) NOT NULL DEFAULT 0, -- Current position size
    average_price DECIMAL(20,8) NOT NULL DEFAULT 0, -- Average entry price
    total_cost DECIMAL(20,8) NOT NULL DEFAULT 0, -- Total cost basis
    unrealized_pnl DECIMAL(20,8) DEFAULT 0, -- Unrealized profit/loss
    realized_pnl DECIMAL(20,8) DEFAULT 0, -- Realized profit/loss
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token_address)
);

-- Indexes for trading_positions
CREATE INDEX idx_trading_positions_user_id ON trading_positions(user_id);
CREATE INDEX idx_trading_positions_token_address ON trading_positions(token_address);

-- ==========================================
-- MARKET DATA HISTORY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS market_data_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address VARCHAR(42) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for market_data_history  
CREATE INDEX idx_market_data_history_token_address ON market_data_history(token_address);
CREATE INDEX idx_market_data_history_created_at ON market_data_history(created_at DESC);

-- ==========================================
-- INDEX TOKENS TABLE (for trading pairs)
-- ==========================================
CREATE TABLE IF NOT EXISTS index_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address VARCHAR(42) UNIQUE NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    components JSONB, -- Array of component tokens and weights
    total_supply DECIMAL(20,8) DEFAULT 0,
    nav_per_token DECIMAL(20,8) DEFAULT 0, -- Net Asset Value per token
    is_active BOOLEAN DEFAULT true,
    is_tradeable BOOLEAN DEFAULT false, -- Whether it can be traded on HyperCore
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for index_tokens
CREATE INDEX idx_index_tokens_symbol ON index_tokens(symbol);
CREATE INDEX idx_index_tokens_is_active ON index_tokens(is_active);
CREATE INDEX idx_index_tokens_is_tradeable ON index_tokens(is_tradeable);

-- ==========================================
-- PORTFOLIO SNAPSHOTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_value DECIMAL(20,8) NOT NULL, -- Total portfolio value in USDC
    positions JSONB NOT NULL, -- Array of position data
    pnl_24h DECIMAL(20,8) DEFAULT 0,
    pnl_total DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for portfolio_snapshots
CREATE INDEX idx_portfolio_snapshots_user_id ON portfolio_snapshots(user_id);
CREATE INDEX idx_portfolio_snapshots_created_at ON portfolio_snapshots(created_at DESC);

-- ==========================================
-- TRADE HISTORY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS trade_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES trading_orders(id) ON DELETE CASCADE,
    token_address VARCHAR(42) NOT NULL,
    side VARCHAR(4) NOT NULL CHECK (side IN ('buy', 'sell')),
    amount DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    total_value DECIMAL(20,8) NOT NULL, -- amount * price
    fee_amount DECIMAL(20,8) DEFAULT 0,
    fee_token VARCHAR(42), -- Which token the fee was paid in
    transaction_hash VARCHAR(66),
    block_number BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for trade_history
CREATE INDEX idx_trade_history_user_id ON trade_history(user_id);
CREATE INDEX idx_trade_history_token_address ON trade_history(token_address);
CREATE INDEX idx_trade_history_created_at ON trade_history(created_at DESC);
CREATE INDEX idx_trade_history_order_id ON trade_history(order_id);

-- ==========================================
-- USER BALANCES TABLE (cached balances)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_address VARCHAR(42) NOT NULL,
    symbol VARCHAR(20),
    available_balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    locked_balance DECIMAL(20,8) NOT NULL DEFAULT 0, -- Locked in orders
    total_balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token_address)
);

-- Indexes for user_balances
CREATE INDEX idx_user_balances_user_id ON user_balances(user_id);
CREATE INDEX idx_user_balances_token_address ON user_balances(token_address);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_trading_orders_updated_at BEFORE UPDATE ON trading_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_positions_updated_at BEFORE UPDATE ON trading_positions  
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_index_tokens_updated_at BEFORE UPDATE ON index_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update remaining_amount when order is partially filled
CREATE OR REPLACE FUNCTION update_order_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.filled_amount != OLD.filled_amount THEN
        NEW.remaining_amount = NEW.amount - NEW.filled_amount;
        
        -- Update status based on fill
        IF NEW.remaining_amount <= 0 THEN
            NEW.status = 'filled';
            NEW.filled_at = NOW();
        ELSIF NEW.filled_amount > 0 THEN
            NEW.status = 'partial';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trading_orders_remaining BEFORE UPDATE ON trading_orders
    FOR EACH ROW EXECUTE FUNCTION update_order_remaining_amount();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE trading_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY trading_orders_user_policy ON trading_orders
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY trading_positions_user_policy ON trading_positions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY portfolio_snapshots_user_policy ON portfolio_snapshots
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY trade_history_user_policy ON trade_history
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY user_balances_user_policy ON user_balances
    FOR ALL USING (user_id = auth.uid());

-- Allow read access to market data and token info
ALTER TABLE market_data_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE index_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY market_data_read_policy ON market_data_history
    FOR SELECT USING (true);

CREATE POLICY index_tokens_read_policy ON index_tokens
    FOR SELECT USING (true);

-- Allow authenticated users to create tokens (for now)
CREATE POLICY index_tokens_create_policy ON index_tokens
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Insert some sample index tokens for testing
INSERT INTO index_tokens (token_address, symbol, name, description, is_active, is_tradeable) VALUES
    ('0x1234567890123456789012345678901234567890', 'MEME_INDEX', 'Meme Coin Index', 'Index of popular meme coins', true, true),
    ('0x2234567890123456789012345678901234567890', 'AI_INDEX', 'AI Token Index', 'Index of AI-related cryptocurrencies', true, true),
    ('0x3234567890123456789012345678901234567890', 'DOG_INDEX', 'Dog Coin Index', 'Index of dog-themed cryptocurrencies', true, true)
ON CONFLICT (token_address) DO NOTHING;

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE trading_orders IS 'Stores all trading orders placed by users';
COMMENT ON TABLE trading_positions IS 'Current trading positions held by users';
COMMENT ON TABLE market_data_history IS 'Historical price data for calculating 24h changes';
COMMENT ON TABLE index_tokens IS 'Information about tradeable index tokens';
COMMENT ON TABLE portfolio_snapshots IS 'Periodic snapshots of user portfolios';
COMMENT ON TABLE trade_history IS 'Record of all executed trades';
COMMENT ON TABLE user_balances IS 'Cached user balances for quick access';

COMMENT ON COLUMN trading_orders.hypercore_order_id IS 'Order ID returned by HyperCore precompile';
COMMENT ON COLUMN trading_orders.remaining_amount IS 'Amount remaining to be filled';
COMMENT ON COLUMN trading_positions.unrealized_pnl IS 'Current unrealized profit/loss';
COMMENT ON COLUMN index_tokens.nav_per_token IS 'Net Asset Value per token';
COMMENT ON COLUMN user_balances.locked_balance IS 'Balance locked in active orders';