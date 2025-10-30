import { getDefaultQuadraticParams } from '../src/types/index.js';
import Decimal from 'decimal.js';

/**
 * Simulate price trajectory and output results
 */
function simulatePriceTrajectory() {
  const params = getDefaultQuadraticParams();

  const a = new Decimal(params.linearCoefficient);
  const b = new Decimal(params.quadraticCoefficient!);
  const base = new Decimal(params.basePrice);

  console.log('🎯 Quadratic Bonding Curve Simulation\n');
  console.log('Parameters:');
  console.log(`  Base Price: $${params.basePrice}`);
  console.log(`  Linear Coefficient (a): ${params.linearCoefficient}`);
  console.log(`  Quadratic Coefficient (b): ${params.quadraticCoefficient}`);
  console.log(`  Graduation Threshold: ${params.graduationThreshold} tokens\n`);

  console.log('Supply (M) | Price ($) | Market Cap ($M) | Linear% | Quadratic%');
  console.log('-----------|-----------|-----------------|---------|------------');

  const steps = [0, 50, 100, 200, 400, 600, 800];

  steps.forEach(supplyM => {
    const s = new Decimal(supplyM * 1_000_000);

    // P(s) = base + a*s + b*s²
    const linearTerm = a.times(s);
    const quadraticTerm = b.times(s.pow(2));
    const price = base.plus(linearTerm).plus(quadraticTerm);

    // Market cap
    const marketCap = price.times(s).dividedBy(1_000_000);

    // Percentages (avoid division by zero)
    const totalGrowth = price.minus(base);
    const linearPct = totalGrowth.isZero() ? new Decimal(0) : linearTerm.dividedBy(totalGrowth).times(100);
    const quadraticPct = totalGrowth.isZero() ? new Decimal(0) : quadraticTerm.dividedBy(totalGrowth).times(100);

    console.log(
      `${supplyM.toString().padEnd(10)} | ` +
      `${price.toFixed(6).padEnd(9)} | ` +
      `${marketCap.toFixed(2).padEnd(15)} | ` +
      `${linearPct.toFixed(1).padEnd(7)}% | ` +
      `${quadraticPct.toFixed(1).padEnd(10)}%`
    );
  });

  console.log('\n✅ Simulation complete!');
  console.log('\n🎯 Design Goals Validation:');

  // Check if 800M tokens reaches ~$5.00
  const final = base.plus(a.times(800_000_000)).plus(b.times(new Decimal(800_000_000).pow(2)));
  console.log(`  - 800M tokens price: $${final.toFixed(6)} (Target: ~$5.00)`);

  // Check transition point (400M)
  const mid = base.plus(a.times(400_000_000)).plus(b.times(new Decimal(400_000_000).pow(2)));
  console.log(`  - 400M tokens price: $${mid.toFixed(6)} (Target: ~$0.50)`);
}

// Run simulation
simulatePriceTrajectory();