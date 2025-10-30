-- Migration: Update Bonding Curve to Quadratic Implementation
-- Description: Migrate from hybrid/complex bonding curves to simple quadratic curves
-- Created: 2025-10-29
-- Author: HyperIndex Team

-- ============================================================
-- 1. Backup existing data (if any)
-- ============================================================

-- Create temporary backup table
CREATE TABLE IF NOT EXISTS bonding_curve_params_backup AS
SELECT * FROM bonding_curve_params;

-- ============================================================
-- 2. Update curve_type enum and constraints
-- ============================================================

-- Drop existing constraints and enum dependencies
ALTER TABLE bonding_curve_params
  DROP CONSTRAINT IF EXISTS bonding_curve_params_curve_type_check;

-- Update curve_type to support new values
ALTER TABLE bonding_curve_params
  ADD CONSTRAINT bonding_curve_params_curve_type_check
  CHECK (curve_type IN ('linear', 'quadratic'));

-- ============================================================
-- 3. Remove unused columns
-- ============================================================

-- Remove complex bonding curve columns (hybrid-specific)
ALTER TABLE bonding_curve_params
  DROP COLUMN IF EXISTS linear_slope CASCADE,
  DROP COLUMN IF EXISTS max_price CASCADE,
  DROP COLUMN IF EXISTS sigmoid_slope CASCADE,
  DROP COLUMN IF EXISTS midpoint CASCADE,
  DROP COLUMN IF EXISTS transition_point CASCADE;

-- ============================================================
-- 4. Add new Quadratic columns
-- ============================================================

-- Add new columns for quadratic implementation
ALTER TABLE bonding_curve_params
  ADD COLUMN IF NOT EXISTS linear_coefficient DECIMAL(20, 18),
  ADD COLUMN IF NOT EXISTS quadratic_coefficient DECIMAL(25, 23),
  ADD COLUMN IF NOT EXISTS graduation_threshold DECIMAL(15, 0);

-- Set NOT NULL constraints with defaults
ALTER TABLE bonding_curve_params
  ALTER COLUMN linear_coefficient SET DEFAULT 0.000000003,
  ALTER COLUMN quadratic_coefficient SET DEFAULT 0.0000000000000000039,
  ALTER COLUMN graduation_threshold SET DEFAULT 800000000;

-- Update existing records to have default values
UPDATE bonding_curve_params
SET
  linear_coefficient = COALESCE(linear_coefficient, 0.000000003),
  quadratic_coefficient = COALESCE(quadratic_coefficient, 0.0000000000000000039),
  graduation_threshold = COALESCE(graduation_threshold, 800000000)
WHERE linear_coefficient IS NULL OR quadratic_coefficient IS NULL OR graduation_threshold IS NULL;

-- Now set NOT NULL constraints
ALTER TABLE bonding_curve_params
  ALTER COLUMN linear_coefficient SET NOT NULL,
  ALTER COLUMN quadratic_coefficient SET NOT NULL,
  ALTER COLUMN graduation_threshold SET NOT NULL;

-- ============================================================
-- 5. Add column constraints and validation
-- ============================================================

-- Add constraints for new columns
ALTER TABLE bonding_curve_params
  ADD CONSTRAINT check_linear_coefficient
  CHECK (linear_coefficient > 0),

  ADD CONSTRAINT check_quadratic_coefficient
  CHECK (quadratic_coefficient > 0),

  ADD CONSTRAINT check_graduation_threshold
  CHECK (graduation_threshold > 0);

-- ============================================================
-- 6. Migrate existing data
-- ============================================================

-- Update existing 'hybrid' curve types to 'quadratic'
UPDATE bonding_curve_params
SET
  curve_type = 'quadratic',
  updated_at = NOW()
WHERE curve_type = 'hybrid' OR curve_type NOT IN ('linear', 'quadratic');

-- Reset target market cap to align with new graduation goals
UPDATE bonding_curve_params
SET
  target_market_cap = 4000000000,  -- $4B target (800M tokens * ~$5)
  updated_at = NOW()
WHERE target_market_cap < 1000000000;  -- Update small market caps

-- ============================================================
-- 7. Update indexes and performance optimizations
-- ============================================================

-- Recreate index on curve_type (enum changed)
DROP INDEX IF EXISTS idx_bonding_curve_params_curve_type;
CREATE INDEX idx_bonding_curve_params_curve_type
  ON bonding_curve_params(curve_type);

-- Add index for graduation queries
CREATE INDEX IF NOT EXISTS idx_bonding_curve_params_graduation
  ON bonding_curve_params(graduation_threshold, target_market_cap);

-- ============================================================
-- 8. Update column comments and documentation
-- ============================================================

-- Update table and column comments
COMMENT ON COLUMN bonding_curve_params.curve_type IS
  'Bonding curve type: linear or quadratic';

COMMENT ON COLUMN bonding_curve_params.linear_coefficient IS
  'Linear coefficient (a) in P(s) = base + a*s + b*s². Default: 3e-9';

COMMENT ON COLUMN bonding_curve_params.quadratic_coefficient IS
  'Quadratic coefficient (b) in P(s) = base + a*s + b*s². Default: 3.9e-18';

COMMENT ON COLUMN bonding_curve_params.graduation_threshold IS
  'Token supply at which the bonding curve completes graduation (default: 800M tokens)';

COMMENT ON COLUMN bonding_curve_params.base_price IS
  'Initial price at supply = 0 (default: $0.001)';

COMMENT ON COLUMN bonding_curve_params.target_market_cap IS
  'Target market cap for graduation (default: $4B)';

-- Update table comment
COMMENT ON TABLE bonding_curve_params IS
  'Quadratic bonding curve parameters for L3 indices. Formula: P(s) = base_price + linear_coefficient*s + quadratic_coefficient*s²';

-- ============================================================
-- 9. Insert default parameters for testing
-- ============================================================

-- Insert default quadratic parameters for any L3 indices without bonding curves
INSERT INTO bonding_curve_params (
  index_id,
  curve_type,
  base_price,
  linear_coefficient,
  quadratic_coefficient,
  target_market_cap,
  graduation_threshold,
  created_at,
  updated_at
)
SELECT
  i.id,
  'quadratic',
  0.001,
  0.000000003,
  0.0000000000000000039,
  4000000000,
  800000000,
  NOW(),
  NOW()
FROM indices i
WHERE i.layer = 'L3'
  AND i.id NOT IN (SELECT index_id FROM bonding_curve_params)
ON CONFLICT (index_id) DO NOTHING;

-- ============================================================
-- 10. Validation and verification
-- ============================================================

-- Verify all L3 indices have bonding curve parameters
DO $$
DECLARE
  l3_count INTEGER;
  bc_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO l3_count FROM indices WHERE layer = 'L3';
  SELECT COUNT(*) INTO bc_count FROM bonding_curve_params;

  IF l3_count != bc_count THEN
    RAISE WARNING 'Mismatch: % L3 indices but % bonding curve params', l3_count, bc_count;
  ELSE
    RAISE NOTICE 'SUCCESS: All % L3 indices have bonding curve parameters', l3_count;
  END IF;
END $$;

-- Verify all curve types are valid
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM bonding_curve_params
  WHERE curve_type NOT IN ('linear', 'quadratic');

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % records with invalid curve_type', invalid_count;
  ELSE
    RAISE NOTICE 'SUCCESS: All curve types are valid (linear or quadratic)';
  END IF;
END $$;

-- Display final table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'bonding_curve_params'
ORDER BY ordinal_position;

-- ============================================================
-- 11. Cleanup
-- ============================================================

-- Drop backup table after successful migration (uncomment if needed)
-- DROP TABLE IF EXISTS bonding_curve_params_backup;

-- Final success message
SELECT
  'Migration completed successfully! Quadratic bonding curve implementation is now active.' as status,
  COUNT(*) as total_bonding_curves,
  COUNT(CASE WHEN curve_type = 'quadratic' THEN 1 END) as quadratic_curves,
  COUNT(CASE WHEN curve_type = 'linear' THEN 1 END) as linear_curves
FROM bonding_curve_params;