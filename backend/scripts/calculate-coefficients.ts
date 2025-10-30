import Decimal from 'decimal.js';

/**
 * Calculate coefficients for quadratic bonding curve
 *
 * Target: P(400M) = 0.5, P(800M) = 5.0
 * Formula: P(s) = 0.001 + a*s + b*s²
 *
 * System of equations:
 * 0.001 + a*400M + b*(400M)² = 0.5
 * 0.001 + a*800M + b*(800M)² = 5.0
 */

function calculateCoefficients() {
  const base = new Decimal('0.001');
  const s1 = new Decimal('400000000'); // 400M
  const s2 = new Decimal('800000000'); // 800M
  const p1 = new Decimal('0.5');       // Target price at 400M
  const p2 = new Decimal('5.0');       // Target price at 800M

  // Adjust for base price
  const p1_adj = p1.minus(base); // 0.499
  const p2_adj = p2.minus(base); // 4.999

  console.log('🧮 Coefficient Calculation');
  console.log('========================');
  console.log(`Base price: ${base}`);
  console.log(`Target P(400M): ${p1} → adjusted: ${p1_adj}`);
  console.log(`Target P(800M): ${p2} → adjusted: ${p2_adj}`);
  console.log();

  // System of equations:
  // a*400M + b*(400M)² = 0.499
  // a*800M + b*(800M)² = 4.999

  const s1_sq = s1.pow(2);
  const s2_sq = s2.pow(2);

  console.log('System of equations:');
  console.log(`a*${s1} + b*${s1_sq} = ${p1_adj}`);
  console.log(`a*${s2} + b*${s2_sq} = ${p2_adj}`);
  console.log();

  // Solve using substitution
  // From eq1: a = (p1_adj - b*s1_sq) / s1
  // Substitute into eq2: ((p1_adj - b*s1_sq) / s1)*s2 + b*s2_sq = p2_adj
  // Simplify: (p1_adj*s2 - b*s1_sq*s2) / s1 + b*s2_sq = p2_adj
  // Multiply by s1: p1_adj*s2 - b*s1_sq*s2 + b*s2_sq*s1 = p2_adj*s1
  // Factor b: p1_adj*s2 + b*(s2_sq*s1 - s1_sq*s2) = p2_adj*s1
  // Solve for b: b = (p2_adj*s1 - p1_adj*s2) / (s2_sq*s1 - s1_sq*s2)

  const numerator = p2_adj.times(s1).minus(p1_adj.times(s2));
  const denominator = s2_sq.times(s1).minus(s1_sq.times(s2));

  const b = numerator.dividedBy(denominator);
  const a = p1_adj.minus(b.times(s1_sq)).dividedBy(s1);

  console.log('Calculated coefficients:');
  console.log(`a (linear): ${a.toString()}`);
  console.log(`b (quadratic): ${b.toString()}`);
  console.log();

  // Verification
  console.log('Verification:');
  const verify_400M = base.plus(a.times(s1)).plus(b.times(s1_sq));
  const verify_800M = base.plus(a.times(s2)).plus(b.times(s2_sq));

  console.log(`P(400M) = ${verify_400M.toString()} (target: ${p1})`);
  console.log(`P(800M) = ${verify_800M.toString()} (target: ${p2})`);

  // Check intermediate points
  console.log();
  console.log('Intermediate points:');
  const supplies = [0, 100, 200, 300, 400, 500, 600, 700, 800];
  supplies.forEach(m => {
    const s = new Decimal(m * 1_000_000);
    const p = base.plus(a.times(s)).plus(b.times(s.pow(2)));
    console.log(`${m}M tokens: $${p.toFixed(6)}`);
  });
}

calculateCoefficients();