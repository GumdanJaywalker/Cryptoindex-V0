// Bonding Curve routes - L3 index trading

import Decimal from 'decimal.js';
import { Router } from 'express';
import {
  calculateBuyPrice,
  calculateSellPrice,
  getPriceAtSupply,
  getCurrentPrice,
  simulatePriceTrajectory,
  getDefaultQuadraticParams,
} from '../services/bondingCurve.supabase.js';
import {
  checkGraduationEligibility,
  getGraduationProgress,
  graduateIndex,
  estimateGraduationTime,
} from '../services/graduation.supabase.js';
import { getIndexById } from '../services/index.supabase.js';
import { AppError } from '../utils/httpError.js';
import type { L3Index } from '../types/index.js';

export const bondingCurveRouter = Router();

/**
 * GET /v1/bonding-curve/:indexId/price
 * Get current price for an L3 index
 */
bondingCurveRouter.get('/:indexId/price', async (req, res, next) => {
  try {
    const { indexId } = req.params;
    
    const index = await getIndexById(indexId);
    
    if (index.layer !== 'L3') {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Bonding curve pricing only available for L3 indices'
      });
    }
    
    const l3Index = index as L3Index;
    const supply = l3Index.bondingCurve?.totalRaised || '0';
    
    res.json({
      success: true,
      data: {
        indexId,
        currentPrice: l3Index.bondingCurve?.currentPrice || '0',
        currentSupply: supply,
        marketCap: l3Index.bondingCurve?.currentMarketCap || '0',
        progress: l3Index.bondingCurve?.progress || '0',
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/bonding-curve/:indexId/quote/buy
 * Get buy quote (price estimation)
 */
bondingCurveRouter.post('/:indexId/quote/buy', async (req, res, next) => {
  try {
    const { indexId } = req.params;
    const { amount } = req.body;
    
    if (!amount || new Decimal(amount).lessThanOrEqualTo(0)) {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Amount must be greater than 0'
      });
    }
    
    const index = await getIndexById(indexId);
    
    if (index.layer !== 'L3') {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Bonding curve trading only available for L3 indices'
      });
    }
    
    // Use new Supabase API (returns simple string price)
    const totalCost = await calculateBuyPrice(indexId, amount);
    const currentPrice = await getCurrentPrice(indexId); // Get current price

    res.json({
      success: true,
      data: {
        amount,
        totalCost: new Decimal(totalCost).toFixed(2),
        estimatedPrice: new Decimal(currentPrice).toFixed(6),
        message: 'Buy quote calculated successfully',
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/bonding-curve/:indexId/quote/sell
 * Get sell quote (price estimation)
 */
bondingCurveRouter.post('/:indexId/quote/sell', async (req, res, next) => {
  try {
    const { indexId } = req.params;
    const { amount } = req.body;
    
    if (!amount || new Decimal(amount).lessThanOrEqualTo(0)) {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Amount must be greater than 0'
      });
    }
    
    const index = await getIndexById(indexId);
    
    if (index.layer !== 'L3') {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Bonding curve trading only available for L3 indices'
      });
    }
    
    // Use new Supabase API (returns simple string price)
    const totalReturn = await calculateSellPrice(indexId, amount);
    const currentPrice = await getCurrentPrice(indexId); // Get current price

    res.json({
      success: true,
      data: {
        amount,
        totalReturn: new Decimal(totalReturn).toFixed(2),
        estimatedPrice: new Decimal(currentPrice).toFixed(6),
        message: 'Sell quote calculated successfully',
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/bonding-curve/:indexId/trajectory
 * Get price trajectory simulation
 */
bondingCurveRouter.get('/:indexId/trajectory', async (req, res, next) => {
  try {
    const { indexId } = req.params;
    const steps = parseInt(req.query.steps as string) || 100;
    
    const index = await getIndexById(indexId);
    
    if (index.layer !== 'L3') {
      throw new AppError(400, {
        code: 'BAD_REQUEST',
        message: 'Trajectory only available for L3 indices'
      });
    }
    
    // Use new Supabase API
    const trajectory = await simulatePriceTrajectory(indexId, steps);
    const params = getDefaultQuadraticParams(); // Get default params for display
    
    res.json({
      success: true,
      data: {
        trajectory,
        params: {
          curveType: params.curveType,
          basePrice: params.basePrice,
          targetMarketCap: params.targetMarketCap,
        },
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /v1/bonding-curve/:indexId/graduation
 * Check graduation eligibility and progress
 */
bondingCurveRouter.get('/:indexId/graduation', async (req, res, next) => {
  try {
    const { indexId } = req.params;
    
    const [progress, timeEstimate] = await Promise.all([
      getGraduationProgress(indexId),
      estimateGraduationTime(indexId),
    ]);
    
    res.json({
      success: true,
      data: {
        ...progress,
        estimatedDaysToGraduation: timeEstimate,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/bonding-curve/:indexId/graduate
 * Graduate L3 index to L2 (requires auth)
 */
bondingCurveRouter.post('/:indexId/graduate', async (req, res, next) => {
  try {
    const userId = req.userId;
    const { indexId } = req.params;
    
    if (!userId) {
      throw new AppError(401, {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }
    
    const result = await graduateIndex(indexId);

    req.log?.info({ indexId }, 'Index graduated successfully');

    res.json({
      success: true,
      data: {
        indexId,
        ...result,
      }
    });
  } catch (error) {
    next(error);
  }
});
