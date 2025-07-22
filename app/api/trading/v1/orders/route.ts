// app/api/trading/v1/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requirePrivyAuth } from '@/lib/middleware/privy-auth';
import { createClient } from '@supabase/supabase-js';
import { TradingOrderService } from '@/lib/trading/order-service';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validation schemas
const CreateOrderSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  type: z.enum(['market', 'limit']),
  side: z.enum(['buy', 'sell']),
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  price: z.string().regex(/^\d+\.?\d*$/, 'Invalid price format').optional(),
  walletPrivateKey: z.string().optional() // For testing - in production, use wallet connect
});

const QuerySchema = z.object({
  status: z.enum(['pending', 'filled', 'cancelled', 'partial']).optional(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  limit: z.string().transform(val => parseInt(val)).default('50'),
  offset: z.string().transform(val => parseInt(val)).default('0')
});

/**
 * POST /api/trading/v1/orders - Create new order
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate input
    const validationResult = CreateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid input',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { tokenAddress, type, side, amount, price, walletPrivateKey } = validationResult.data;

    // Validate that price is provided for limit orders
    if (type === 'limit' && !price) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Price is required for limit orders'
        },
        { status: 400 }
      );
    }

    // Validate token exists and is tradeable
    const { data: tokenData, error: tokenError } = await supabase
      .from('index_tokens')
      .select('id, symbol, is_active, is_tradeable')
      .eq('token_address', tokenAddress)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Token not found'
        },
        { status: 404 }
      );
    }

    if (!tokenData.is_active || !tokenData.is_tradeable) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Token is not available for trading'
        },
        { status: 400 }
      );
    }

    // Create order using trading service
    const orderService = TradingOrderService.getInstance();
    const orderResult = await orderService.createOrder({
      userId: user.id,
      tokenAddress,
      type,
      side,
      amount,
      price,
      walletPrivateKey // Remove this in production
    });

    if (!orderResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: orderResult.error
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: orderResult.order
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/trading/v1/orders - Get user orders
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requirePrivyAuth(request);
    if (!authResult.isAuthenticated) {
      return authResult.response;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryData = Object.fromEntries(searchParams);
    const validationResult = QuerySchema.safeParse(queryData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { status, tokenAddress, limit, offset } = validationResult.data;

    // Build query
    let query = supabase
      .from('trading_orders')
      .select(`
        *,
        index_tokens!inner(symbol, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (tokenAddress) {
      query = query.eq('token_address', tokenAddress);
    }

    const { data: orders, error } = await query;

    if (error) {
      throw error;
    }

    // Format response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      tokenAddress: order.token_address,
      symbol: order.index_tokens?.symbol || 'UNKNOWN',
      tokenName: order.index_tokens?.name || 'Unknown Token',
      type: order.order_type,
      side: order.side,
      amount: order.amount,
      price: order.price,
      status: order.status,
      filledAmount: order.filled_amount || '0',
      remainingAmount: order.remaining_amount || order.amount,
      averageFillPrice: order.average_fill_price,
      transactionHash: order.transaction_hash,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      filledAt: order.filled_at,
      cancelledAt: order.cancelled_at,
      errorMessage: order.error_message
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        limit,
        offset,
        total: formattedOrders.length // In production, get actual count
      }
    });

  } catch (error) {
    console.error('❌ Get orders error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}