-- Final Migration for P2PFiat Platform (Fixed for existing schema)
-- Date: 2025-07-18
-- Description: Add security, fraud detection, and monitoring features to existing schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =======================================a=====================================
-- UPDATE EXISTING USERS TABLE (if needed)
-- ============================================================================

-- Add columns to users table if they don't exist
DO $$
BEGIN
    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'metadata') THEN
        ALTER TABLE users ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END
$$;

-- ============================================================================
-- UPDATE EXISTING USER_WALLETS TABLE (if needed)
-- ============================================================================

-- Add columns to user_wallets table if they don't exist
DO $$
BEGIN
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_wallets' AND column_name = 'updated_at') THEN
        ALTER TABLE user_wallets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_wallets' AND column_name = 'metadata') THEN
        ALTER TABLE user_wallets ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END
$$;

-- ============================================================================
-- NEW TABLES FOR SECURITY AND MONITORING
-- ============================================================================

-- Main transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'fee')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Financial data
  amount DECIMAL(18, 6) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USDC',
  fee_amount DECIMAL(18, 6) DEFAULT 0,
  
  -- Network data
  network TEXT NOT NULL DEFAULT 'hyperliquid',
  from_address TEXT,
  to_address TEXT,
  transaction_hash TEXT,
  block_number BIGINT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Risk assessment
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  requires_review BOOLEAN DEFAULT false,
  
  -- Timestamps
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User behavior patterns table
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction patterns
  avg_transaction_amount DECIMAL(18, 6) DEFAULT 0,
  typical_hours INTEGER[] DEFAULT '{}',
  frequent_destinations TEXT[] DEFAULT '{}',
  avg_time_between_txn BIGINT DEFAULT 86400000,
  preferred_networks TEXT[] DEFAULT '{}',
  
  -- Device and location patterns
  device_fingerprints TEXT[] DEFAULT '{}',
  ip_history INET[] DEFAULT '{}',
  geolocation_history TEXT[] DEFAULT '{}',
  
  -- Risk assessment
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors JSONB DEFAULT '[]',
  
  -- Machine learning features
  ml_features JSONB DEFAULT '{}',
  last_ml_update TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT user_behavior_patterns_user_unique UNIQUE(user_id)
);

-- Fraud analysis logs table
CREATE TABLE IF NOT EXISTS fraud_analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  
  -- Analysis results
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors JSONB NOT NULL DEFAULT '[]',
  recommendation TEXT NOT NULL CHECK (recommendation IN ('approve', 'review', 'block')),
  confidence DECIMAL(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
  
  -- ML prediction
  ml_prediction DECIMAL(5, 2),
  ml_model_version TEXT,
  ml_features JSONB,
  
  -- Transaction context
  transaction_data JSONB,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  geolocation JSONB,
  
  -- Analysis metadata
  analysis_duration_ms INTEGER,
  analysis_version TEXT DEFAULT '1.0',
  
  -- Manual review
  manual_review_required BOOLEAN DEFAULT false,
  manual_review_completed BOOLEAN DEFAULT false,
  manual_reviewer_id UUID REFERENCES users(id),
  manual_review_decision TEXT CHECK (manual_review_decision IN ('approve', 'reject', 'escalate')),
  manual_review_notes TEXT,
  manual_review_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Incident classification
  incident_type TEXT NOT NULL CHECK (incident_type IN (
    'fraud', 'intrusion', 'abuse', 'system'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  
  -- Incident details
  title TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '{}',
  
  -- Risk assessment
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  impact_assessment TEXT,
  
  -- Response tracking
  assigned_to UUID REFERENCES users(id),
  response_actions JSONB DEFAULT '[]',
  resolution_notes TEXT,
  
  -- Escalation
  escalated BOOLEAN DEFAULT false,
  escalated_to UUID REFERENCES users(id),
  escalated_at TIMESTAMP WITH TIME ZONE,
  escalation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Comprehensive audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event identification
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN (
    'authentication', 'authorization', 'transaction', 'admin', 'security', 'system'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  
  -- User context
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  impersonated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Request context
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  geolocation JSONB,
  
  -- Event details
  resource_type TEXT,
  resource_id TEXT,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'failure', 'partial')),
  
  -- Event data
  event_data JSONB DEFAULT '{}',
  before_state JSONB,
  after_state JSONB,
  changes JSONB,
  
  -- Technical details
  request_id TEXT,
  correlation_id TEXT,
  source_system TEXT DEFAULT 'p2pfiat-platform',
  api_endpoint TEXT,
  http_method TEXT,
  response_code INTEGER,
  processing_time_ms INTEGER,
  
  -- Error details (if applicable)
  error_code TEXT,
  error_message TEXT,
  stack_trace TEXT,
  
  -- Compliance and retention
  retention_category TEXT DEFAULT 'standard' CHECK (retention_category IN ('minimal', 'standard', 'extended', 'permanent')),
  pii_fields TEXT[] DEFAULT '{}',
  compliance_tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Device tracking table
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device identification
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  
  -- Device status
  is_trusted BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Security metadata
  first_seen_ip INET,
  first_seen_location JSONB,
  last_seen_ip INET,
  last_seen_location JSONB,
  
  -- Usage tracking
  login_count INTEGER DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_transaction_at TIMESTAMP WITH TIME ZONE,
  
  -- Risk assessment
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT user_devices_user_fingerprint_unique UNIQUE(user_id, device_fingerprint)
);

-- IP address tracking table
CREATE TABLE IF NOT EXISTS ip_address_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  
  -- Geolocation data
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT,
  
  -- IP classification
  ip_type TEXT CHECK (ip_type IN ('residential', 'business', 'hosting', 'vpn', 'proxy', 'tor', 'unknown')),
  isp TEXT,
  organization TEXT,
  
  -- Risk assessment
  is_vpn BOOLEAN DEFAULT false,
  is_proxy BOOLEAN DEFAULT false,
  is_tor BOOLEAN DEFAULT false,
  is_malicious BOOLEAN DEFAULT false,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  
  -- Usage tracking
  user_count INTEGER DEFAULT 0,
  login_count INTEGER DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  
  -- Reputation data
  reputation_sources JSONB DEFAULT '{}',
  blacklist_status JSONB DEFAULT '{}',
  
  -- Timestamps
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT ip_address_tracking_ip_unique UNIQUE(ip_address)
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limiting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Rate limit key (user_id, ip_address, or other identifier)
  rate_limit_key TEXT NOT NULL,
  rate_limit_type TEXT NOT NULL CHECK (rate_limit_type IN (
    'login_attempts', 'transaction_requests', 'api_calls', 'password_resets', 'otp_requests'
  )),
  
  -- Rate limiting data
  request_count INTEGER NOT NULL DEFAULT 1,
  max_requests INTEGER NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  window_duration_seconds INTEGER NOT NULL,
  
  -- Additional context
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Constraints
  CONSTRAINT rate_limiting_key_type_window_unique UNIQUE(rate_limit_key, rate_limit_type, window_start)
);

-- Network configurations table
CREATE TABLE IF NOT EXISTS network_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_name TEXT NOT NULL UNIQUE,
  chain_id TEXT NOT NULL UNIQUE,
  rpc_url TEXT NOT NULL,
  explorer_url TEXT,
  native_currency JSONB NOT NULL,
  is_testnet BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Existing table indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_users_privy_user_id ON users(privy_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_wallet_address ON user_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_wallets_is_primary ON user_wallets(is_primary);

-- New table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_network ON transactions(network);

CREATE INDEX IF NOT EXISTS idx_user_behavior_patterns_user_id ON user_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_patterns_risk_score ON user_behavior_patterns(risk_score);
CREATE INDEX IF NOT EXISTS idx_user_behavior_patterns_updated_at ON user_behavior_patterns(updated_at);

CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_user_id ON fraud_analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_transaction_id ON fraud_analysis_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_risk_score ON fraud_analysis_logs(risk_score);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_recommendation ON fraud_analysis_logs(recommendation);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_created_at ON fraud_analysis_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_logs_manual_review ON fraud_analysis_logs(manual_review_required, manual_review_completed);

CREATE INDEX IF NOT EXISTS idx_security_incidents_user_id ON security_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_security_incidents_type_severity ON security_incidents(incident_type, severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON security_incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_security_incidents_assigned_to ON security_incidents(assigned_to);

CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_category_severity ON security_audit_log(event_category, severity);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_ip_address ON security_audit_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_outcome ON security_audit_log(outcome);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_expires_at ON security_audit_log(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_fingerprint ON user_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_devices_trusted ON user_devices(is_trusted);
CREATE INDEX IF NOT EXISTS idx_user_devices_active ON user_devices(is_active);
CREATE INDEX IF NOT EXISTS idx_user_devices_risk_score ON user_devices(risk_score);

CREATE INDEX IF NOT EXISTS idx_ip_address_tracking_ip ON ip_address_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_address_tracking_risk_score ON ip_address_tracking(risk_score);
CREATE INDEX IF NOT EXISTS idx_ip_address_tracking_malicious ON ip_address_tracking(is_malicious);
CREATE INDEX IF NOT EXISTS idx_ip_address_tracking_vpn_proxy ON ip_address_tracking(is_vpn, is_proxy, is_tor);

CREATE INDEX IF NOT EXISTS idx_rate_limiting_key_type ON rate_limiting(rate_limit_key, rate_limit_type);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_expires_at ON rate_limiting(expires_at);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to validate typical hours array
CREATE OR REPLACE FUNCTION validate_typical_hours()
RETURNS TRIGGER AS $$
DECLARE
    hour_value INTEGER;
BEGIN
    -- Check typical_hours array if not null
    IF NEW.typical_hours IS NOT NULL THEN
        -- Check array length
        IF array_length(NEW.typical_hours, 1) > 24 THEN
            RAISE EXCEPTION 'typical_hours array cannot have more than 24 elements';
        END IF;
        
        -- Check each hour value
        FOREACH hour_value IN ARRAY NEW.typical_hours
        LOOP
            IF hour_value < 0 OR hour_value > 23 THEN
                RAISE EXCEPTION 'typical_hours must contain values between 0 and 23, found: %', hour_value;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to cleanup expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limiting WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Function to cleanup expired audit logs
CREATE OR REPLACE FUNCTION cleanup_expired_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM security_audit_log 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- Function to calculate device risk score
CREATE OR REPLACE FUNCTION calculate_device_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Simple risk scoring based on device characteristics
    NEW.risk_score = 0;
    
    -- New device gets higher risk
    IF NEW.login_count <= 1 THEN
        NEW.risk_score = NEW.risk_score + 30;
    ELSIF NEW.login_count <= 5 THEN
        NEW.risk_score = NEW.risk_score + 15;
    END IF;
    
    -- Untrusted device gets higher risk
    IF NOT NEW.is_trusted THEN
        NEW.risk_score = NEW.risk_score + 20;
    END IF;
    
    -- Unknown device type gets higher risk
    IF NEW.device_type = 'unknown' THEN
        NEW.risk_score = NEW.risk_score + 10;
    END IF;
    
    -- Cap at 100
    NEW.risk_score = LEAST(NEW.risk_score, 100);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically create security incidents for high-risk transactions
CREATE OR REPLACE FUNCTION create_security_incident_for_high_risk()
RETURNS TRIGGER AS $$
BEGIN
    -- Create incident for high-risk fraud analysis
    IF NEW.risk_score >= 80 AND NEW.recommendation = 'block' THEN
        INSERT INTO security_incidents (
            user_id, incident_type, severity, title, description, evidence, risk_score
        ) VALUES (
            NEW.user_id,
            'fraud',
            CASE 
                WHEN NEW.risk_score >= 95 THEN 'critical'
                WHEN NEW.risk_score >= 90 THEN 'high'
                ELSE 'medium'
            END,
            'High-risk transaction detected',
            'Automated fraud detection flagged transaction with risk score: ' || NEW.risk_score,
            jsonb_build_object(
                'fraud_analysis_id', NEW.id,
                'risk_score', NEW.risk_score,
                'risk_factors', NEW.risk_factors,
                'transaction_data', NEW.transaction_data
            ),
            NEW.risk_score
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT AND VALIDATION
-- ============================================================================

-- Create updated_at triggers for existing tables (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_wallets_updated_at') THEN
        CREATE TRIGGER update_user_wallets_updated_at
            BEFORE UPDATE ON user_wallets
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Create updated_at triggers for new tables
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_behavior_patterns_updated_at
    BEFORE UPDATE ON user_behavior_patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER validate_user_behavior_patterns_hours
    BEFORE INSERT OR UPDATE ON user_behavior_patterns
    FOR EACH ROW
    EXECUTE FUNCTION validate_typical_hours();

CREATE TRIGGER update_fraud_analysis_logs_updated_at
    BEFORE UPDATE ON fraud_analysis_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_incidents_updated_at
    BEFORE UPDATE ON security_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_devices_updated_at
    BEFORE UPDATE ON user_devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calculate_user_device_risk_score
    BEFORE INSERT OR UPDATE ON user_devices
    FOR EACH ROW
    EXECUTE FUNCTION calculate_device_risk_score();

CREATE TRIGGER update_ip_address_tracking_updated_at
    BEFORE UPDATE ON ip_address_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_limiting_updated_at
    BEFORE UPDATE ON rate_limiting
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_configs_updated_at
    BEFORE UPDATE ON network_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER create_incident_for_high_risk_fraud
    AFTER INSERT ON fraud_analysis_logs
    FOR EACH ROW
    WHEN (NEW.risk_score >= 80 AND NEW.recommendation = 'block')
    EXECUTE FUNCTION create_security_incident_for_high_risk();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert default network configurations
INSERT INTO network_configs (network_name, chain_id, rpc_url, explorer_url, native_currency, is_testnet) VALUES
('Hyperliquid Mainnet', '0x3E7', 'https://rpc.hyperliquid.xyz/evm', 'https://explorer.hyperliquid.xyz', '{"name":"HYPE","symbol":"HYPE","decimals":18}', false),
('Hyperliquid Testnet', '0x3E6', 'https://rpc.hyperliquid-testnet.xyz/evm', 'https://explorer.hyperliquid-testnet.xyz', '{"name":"HYPE","symbol":"HYPE","decimals":18}', true),
('Ethereum Mainnet', '0x1', 'https://ethereum.publicnode.com', 'https://etherscan.io', '{"name":"Ether","symbol":"ETH","decimals":18}', false),
('Arbitrum One', '0xA4B1', 'https://arb1.arbitrum.io/rpc', 'https://arbiscan.io', '{"name":"Ether","symbol":"ETH","decimals":18}', false)
ON CONFLICT (network_name) DO NOTHING;

-- ============================================================================
-- DASHBOARD VIEWS
-- ============================================================================

-- Create views for security dashboard
CREATE OR REPLACE VIEW security_dashboard_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_events,
    COUNT(*) FILTER (WHERE severity = 'high') as high_events,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium_events,
    COUNT(*) FILTER (WHERE event_category = 'transaction') as transaction_events,
    COUNT(*) FILTER (WHERE event_category = 'authentication') as auth_events,
    COUNT(*) FILTER (WHERE outcome = 'failure') as failed_events
FROM security_audit_log
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW fraud_detection_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_analyses,
    COUNT(*) FILTER (WHERE recommendation = 'block') as blocked_transactions,
    COUNT(*) FILTER (WHERE recommendation = 'review') as flagged_for_review,
    COUNT(*) FILTER (WHERE risk_score >= 80) as high_risk_transactions,
    AVG(risk_score) as avg_risk_score,
    COUNT(*) FILTER (WHERE manual_review_required = true) as manual_reviews_needed,
    COUNT(*) FILTER (WHERE manual_review_completed = true) as manual_reviews_completed
FROM fraud_analysis_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - BASIC SETUP
-- ============================================================================

-- Enable RLS on tables (policies should be configured based on your auth system)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_address_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FINAL PERMISSIONS
-- ============================================================================

-- Grant permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_behavior_patterns TO authenticated;
GRANT SELECT ON fraud_analysis_logs TO authenticated;
GRANT SELECT ON security_incidents TO authenticated;
GRANT SELECT ON security_audit_log TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_devices TO authenticated;
GRANT SELECT ON ip_address_tracking TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON rate_limiting TO authenticated;
GRANT SELECT ON network_configs TO authenticated;

-- Grant view permissions
GRANT SELECT ON security_dashboard_summary TO authenticated;
GRANT SELECT ON fraud_detection_summary TO authenticated;

-- Grant all permissions to service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
INSERT INTO security_audit_log (
    event_type, 
    event_category, 
    severity, 
    action, 
    outcome, 
    event_data
) VALUES (
    'database_migration',
    'system',
    'info',
    'schema_migration',
    'success',
    jsonb_build_object(
        'migration_file', 'final_migration_0718_fixed.sql',
        'migration_date', NOW(),
        'tables_added', ARRAY[
            'transactions', 'user_behavior_patterns', 'fraud_analysis_logs',
            'security_incidents', 'security_audit_log', 'user_devices',
            'ip_address_tracking', 'rate_limiting', 'network_configs'
        ],
        'existing_tables_updated', ARRAY['users', 'user_wallets']
    )
);

-- Migration completed successfully!
SELECT 'P2PFiat Database Migration Completed Successfully! (Fixed for existing schema)' as status;