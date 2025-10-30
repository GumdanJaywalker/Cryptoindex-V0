import Decimal from 'decimal.js';

/**
 * Design quadratic bonding curve with proper characteristics
 *
 * Goals:
 * 1. Linear-dominant in early stage (0-400M)
 * 2. Quadratic-dominant in late stage (400M-800M)
 * 3. Reasonable graduation price at 800M (~$1-5)
 * 4. No negative prices
 */

function designCurve() {
  // Start with a reasonable linear slope
  const base = new Decimal('0.001');             // $0.001 base price
  const a = new Decimal('0.000000003');          // 3e-9 linear coefficient
  const b = new Decimal('0.0000000000000000039'); // 3.9e-18 quadratic coefficient

  console.log('🎯 Quadratic Bonding Curve Design');
  console.log('=================================');
  console.log(`Formula: P(s) = ${base} + ${a}*s + ${b}*s²`);
  console.log();

  console.log('Supply (M) | Price ($) | Market Cap ($M) | Linear Component | Quadratic Component | L% | Q%');
  console.log('-----------|-----------|-----------------|------------------|---------------------|----|----|');

  const supplies = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800];

  supplies.forEach(m => {
    const s = new Decimal(m * 1_000_000);

    const linearTerm = a.times(s);
    const quadraticTerm = b.times(s.pow(2));
    const price = base.plus(linearTerm).plus(quadraticTerm);
    const marketCap = price.times(s).dividedBy(1_000_000);

    // Calculate percentages of growth (excluding base)
    const totalGrowth = linearTerm.plus(quadraticTerm);
    const linearPct = totalGrowth.isZero() ? new Decimal(0) : linearTerm.dividedBy(totalGrowth).times(100);
    const quadraticPct = totalGrowth.isZero() ? new Decimal(0) : quadraticTerm.dividedBy(totalGrowth).times(100);

    console.log(
      `${m.toString().padEnd(10)} | ` +
      `${price.toFixed(6).padEnd(9)} | ` +
      `${marketCap.toFixed(2).padEnd(15)} | ` +
      `${linearTerm.toFixed(9).padEnd(16)} | ` +
      `${quadraticTerm.toFixed(9).padEnd(19)} | ` +
      `${linearPct.toFixed(0).padEnd(2)}%| ` +
      `${quadraticPct.toFixed(0).padEnd(2)}%`
    );
  });

  console.log();
  console.log('📊 Analysis:');

  // Check transition point (where quadratic becomes dominant)
  const transition = findTransitionPoint(a, b);
  console.log(`- Transition point: ~${transition.dividedBy(1_000_000).toFixed(0)}M tokens`);

  // Final price at 800M
  const final = base.plus(a.times(800_000_000)).plus(b.times(new Decimal(800_000_000).pow(2)));
  console.log(`- Final price at 800M: $${final.toFixed(6)}`);

  // Market cap at graduation
  const finalMarketCap = final.times(800_000_000);
  console.log(`- Market cap at graduation: $${finalMarketCap.dividedBy(1_000_000).toFixed(0)}M`);

  console.log();
  console.log('✅ Coefficients for implementation:');
  console.log(`linearCoefficient: '${a.toString()}'`);
  console.log(`quadraticCoefficient: '${b.toString()}'`);
}

function findTransitionPoint(a: Decimal, b: Decimal): Decimal {
  // Transition point where linear term = quadratic term
  // a*s = b*s² => s = a/b
  return a.dividedBy(b);
}

designCurve();