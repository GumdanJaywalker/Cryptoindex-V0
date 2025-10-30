import Decimal from 'decimal.js';

/**
 * Verify integral calculation for bonding curve
 *
 * For P(s) = base + a*s + b*s²
 * Integral = base*s + a*s²/2 + b*s³/3
 * Cost from s0 to s1 = Integral(s1) - Integral(s0)
 */

function calculateIntegral(base: Decimal, a: Decimal, b: Decimal, s: Decimal): Decimal {
  return base.times(s)
    .plus(a.times(s.pow(2)).dividedBy(2))
    .plus(b.times(s.pow(3)).dividedBy(3));
}

function verifyCostCalculation() {
  // Test parameters
  const base = new Decimal('0.001');
  const a = new Decimal('0.000000003');
  const b = new Decimal('0.0000000000000000039');

  const s0 = new Decimal('100000000'); // 100M
  const s1 = new Decimal('101000000'); // 101M (buying 1M tokens)

  console.log('🧮 Integral Calculation Verification');
  console.log('===================================');
  console.log(`Base: ${base}`);
  console.log(`Linear coefficient (a): ${a}`);
  console.log(`Quadratic coefficient (b): ${b}`);
  console.log(`s0 (start supply): ${s0.dividedBy(1_000_000)}M`);
  console.log(`s1 (end supply): ${s1.dividedBy(1_000_000)}M`);
  console.log();

  // Calculate using integral method
  const integral_s0 = calculateIntegral(base, a, b, s0);
  const integral_s1 = calculateIntegral(base, a, b, s1);
  const cost_integral = integral_s1.minus(integral_s0);

  console.log('Integral method:');
  console.log(`∫P(s)ds from ${s0.dividedBy(1_000_000)}M to ${s1.dividedBy(1_000_000)}M = ${cost_integral.toFixed(8)}`);

  // Calculate using our implementation method
  const amount = s1.minus(s0);
  const baseCost = base.times(amount);
  const linearCost = a.times(s1.pow(2).minus(s0.pow(2))).dividedBy(2);
  const quadraticCost = b.times(s1.pow(3).minus(s0.pow(3))).dividedBy(3);
  const cost_implementation = baseCost.plus(linearCost).plus(quadraticCost);

  console.log();
  console.log('Implementation method:');
  console.log(`Base cost: ${baseCost.toFixed(8)}`);
  console.log(`Linear cost: ${linearCost.toFixed(8)}`);
  console.log(`Quadratic cost: ${quadraticCost.toFixed(8)}`);
  console.log(`Total cost: ${cost_implementation.toFixed(8)}`);

  // Compare
  const difference = cost_integral.minus(cost_implementation).abs();
  console.log();
  console.log('Comparison:');
  console.log(`Integral method: ${cost_integral.toFixed(10)}`);
  console.log(`Implementation:  ${cost_implementation.toFixed(10)}`);
  console.log(`Difference:      ${difference.toFixed(15)}`);

  if (difference.lessThan('0.000000000001')) {
    console.log('✅ PASS: Methods match within precision tolerance');
  } else {
    console.log('❌ FAIL: Methods do not match');
  }

  // Test average price approximation accuracy
  const avgPrice = new Decimal('0.340000'); // Approximate price at 100M
  const approxCost = avgPrice.times(amount);
  const avgError = cost_integral.minus(approxCost).abs();

  console.log();
  console.log('Average price approximation:');
  console.log(`Exact cost: ${cost_integral.toFixed(6)}`);
  console.log(`Approx cost: ${approxCost.toFixed(6)}`);
  console.log(`Error: ${avgError.toFixed(6)} (${avgError.dividedBy(cost_integral).times(100).toFixed(2)}%)`);
}

verifyCostCalculation();