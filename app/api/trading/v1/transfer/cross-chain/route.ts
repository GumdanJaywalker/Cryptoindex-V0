// app/api/trading/v1/transfer/cross-chain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requirePrivyAuth } from '@/lib/middleware/privy-auth';
import { CrossChainBalanceService } from '@/lib/trading/cross-chain-balance-service';
import { WebSocketManager } from '@/lib/trading/websocket-manager';
import { z } from 'zod';

const TransferSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  direction: z.enum(['to_hypercore', 'to_evm'], {
    errorMap: () => ({ message: 'Direction must be to_hypercore or to_evm' })
  })
});

/**
 * POST /api/trading/v1/transfer/cross-chain - Transfer tokens between chains
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
    const validationResult = TransferSchema.safeParse(body);
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

    const { tokenAddress, amount, direction } = validationResult.data;

    // Get cross-chain balance service
    const balanceService = CrossChainBalanceService.getInstance();
    const wsManager = WebSocketManager.getInstance();

    // Check current balance
    const currentBalance = await balanceService.getUnifiedBalance(user.id, tokenAddress);
    if (!currentBalance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to fetch current balance'
        },
        { status: 400 }
      );
    }

    // Validate sufficient balance
    const sourceChain = direction === 'to_hypercore' ? 'evm' : 'hypercore';
    const availableBalance = parseFloat(currentBalance.balances[sourceChain].available);
    const transferAmount = parseFloat(amount);

    if (availableBalance < transferAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient ${sourceChain.toUpperCase()} balance`,
          details: {
            available: currentBalance.balances[sourceChain].available,
            requested: amount
          }
        },
        { status: 400 }
      );
    }

    console.log(`🔄 Initiating cross-chain transfer: ${amount} ${currentBalance.symbol} ${direction}`);

    // Execute transfer
    let transferResult;
    if (direction === 'to_hypercore') {
      transferResult = await balanceService.transferToHyperCore(user.id, tokenAddress, amount);
    } else {
      transferResult = await balanceService.transferToEVM(user.id, tokenAddress, amount);
    }

    if (!transferResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: transferResult.error || 'Transfer failed'
        },
        { status: 400 }
      );
    }

    // Get updated balance
    const updatedBalance = await balanceService.getUnifiedBalance(user.id, tokenAddress);

    // Broadcast balance update via WebSocket
    if (updatedBalance) {
      wsManager.broadcastBalanceUpdate(user.id, tokenAddress, updatedBalance.balances);
    }

    return NextResponse.json({
      success: true,
      message: 'Cross-chain transfer completed successfully',
      transfer: {
        tokenAddress,
        symbol: currentBalance.symbol,
        amount,
        direction,
        transactionHash: transferResult.transactionHash,
        estimatedTime: transferResult.estimatedTime
      },
      updatedBalance: updatedBalance ? {
        evm: updatedBalance.balances.evm,
        hypercore: updatedBalance.balances.hypercore,
        combined: updatedBalance.balances.combined
      } : null
    });

  } catch (error) {
    console.error('❌ Cross-chain transfer error:', error);
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
 * GET /api/trading/v1/transfer/cross-chain - Get optimization suggestions
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
    
    const tokenAddress = searchParams.get('tokenAddress');
    const intendedAction = searchParams.get('action') as 'trade' | 'stake' | 'transfer';

    if (!tokenAddress || !intendedAction) {
      return NextResponse.json(
        {
          success: false,
          error: 'tokenAddress and action parameters are required'
        },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token address format'
        },
        { status: 400 }
      );
    }

    if (!['trade', 'stake', 'transfer'].includes(intendedAction)) {
      return NextResponse.json(
        {
          success: false,
          error: 'action must be one of: trade, stake, transfer'
        },
        { status: 400 }
      );
    }

    // Get cross-chain balance service
    const balanceService = CrossChainBalanceService.getInstance();

    // Get optimization suggestion
    const suggestion = await balanceService.suggestOptimalBalance(
      user.id,
      tokenAddress,
      intendedAction
    );

    if (!suggestion) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to generate optimization suggestion'
        },
        { status: 404 }
      );
    }

    // Get current balance for comparison
    const currentBalance = await balanceService.getUnifiedBalance(user.id, tokenAddress);

    return NextResponse.json({
      success: true,
      optimization: {
        intendedAction,
        currentBalance: currentBalance ? {
          evm: currentBalance.balances.evm.total,
          hypercore: currentBalance.balances.hypercore.total,
          combined: currentBalance.balances.combined.total
        } : null,
        recommended: suggestion.recommended,
        transfers: suggestion.transfers,
        estimatedSavings: {
          gasFees: 'Optimized distribution reduces transaction costs',
          time: 'Faster execution with pre-positioned assets',
          slippage: 'Better liquidity access reduces slippage'
        }
      }
    });

  } catch (error) {
    console.error('❌ Get optimization suggestion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}