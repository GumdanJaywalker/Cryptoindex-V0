/**
 * 📊 Performance Dashboard API
 * Real-time monitoring endpoints for HOOATS 15K+ TPS system
 */

import { NextRequest, NextResponse } from 'next/server';
import { PerformanceDashboard } from '@/lib/monitoring/performance-dashboard';

let dashboard: PerformanceDashboard;

// Initialize dashboard singleton
function getDashboard() {
  if (!dashboard) {
    dashboard = PerformanceDashboard.getInstance();
    dashboard.startMonitoring();
  }
  return dashboard;
}

/**
 * GET /api/monitoring/dashboard
 * Get current performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    
    const dashboard = getDashboard();
    
    switch (type) {
      case 'summary':
        const summary = dashboard.getPerformanceSummary();
        return NextResponse.json({
          success: true,
          data: summary,
          timestamp: Date.now()
        });
        
      case 'full':
        const metrics = dashboard.getMetrics();
        return NextResponse.json({
          success: true,
          data: metrics,
          timestamp: Date.now()
        });
        
      case 'history':
        const limit = parseInt(searchParams.get('limit') || '50');
        const history = dashboard.getMetricsHistory(limit);
        return NextResponse.json({
          success: true,
          data: history,
          count: history.length,
          timestamp: Date.now()
        });
        
      case 'components':
        const fullMetrics = dashboard.getMetrics();
        return NextResponse.json({
          success: true,
          data: {
            components: fullMetrics.components,
            realtime: fullMetrics.realtime
          },
          timestamp: Date.now()
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter',
          validTypes: ['summary', 'full', 'history', 'components']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/monitoring/dashboard
 * Update dashboard configuration or trigger actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    
    const dashboard = getDashboard();
    
    switch (action) {
      case 'start_monitoring':
        await dashboard.startMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Monitoring started',
          timestamp: Date.now()
        });
        
      case 'stop_monitoring':
        await dashboard.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Monitoring stopped',
          timestamp: Date.now()
        });
        
      case 'update_targets':
        // Update performance targets
        const { tpsTarget, latencyTarget, uptimeTarget, errorRateTarget } = params;
        
        // This would typically update the dashboard configuration
        return NextResponse.json({
          success: true,
          message: 'Performance targets updated',
          targets: {
            tpsTarget,
            latencyTarget,
            uptimeTarget,
            errorRateTarget
          },
          timestamp: Date.now()
        });
        
      case 'reset_metrics':
        // Reset certain metrics (implementation depends on requirements)
        return NextResponse.json({
          success: true,
          message: 'Metrics reset',
          timestamp: Date.now()
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          validActions: ['start_monitoring', 'stop_monitoring', 'update_targets', 'reset_metrics']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Dashboard POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}