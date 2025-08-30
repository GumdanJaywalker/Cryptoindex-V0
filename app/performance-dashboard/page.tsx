'use client';

/**
 * 🚀 Ultra Performance Dashboard
 * Real-time monitoring interface for HOOATS 15K+ TPS system
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Zap, 
  Shield, 
  Database, 
  MemoryStick,
  Cpu,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play
} from 'lucide-react';

interface PerformanceMetrics {
  systemTPS: number;
  peakTPS: number;
  averageLatency: number;
  uptime: string;
  successRate: number;
  status: 'healthy' | 'warning' | 'critical';
  targets: {
    tpsAchievement: number;
    latencyAchievement: boolean;
    uptimeAchievement: boolean;
    errorRateAchievement: boolean;
  };
  componentHealth: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'offline';
    tps: number;
    latency: number;
  }>;
}

interface RealtimeData {
  activeOrders: number;
  queuedSettlements: number;
  connectedUsers: number;
  memoryUsage: number;
  cpuUsage: number;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'offline':
      return <Pause className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    healthy: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
    offline: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  return (
    <Badge className={colors[status as keyof typeof colors] || colors.offline}>
      <StatusIcon status={status} />
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  );
};

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Fetch performance metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard?type=summary');
      const result = await response.json();
      
      if (result.success) {
        setMetrics(result.data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    }
  }, []);

  // Fetch realtime data
  const fetchRealtimeData = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard?type=components');
      const result = await response.json();
      
      if (result.success) {
        setRealtimeData(result.data.realtime);
      }
    } catch (err) {
      console.error('Error fetching realtime data:', err);
    }
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!isMonitoring) return;

    fetchMetrics();
    fetchRealtimeData();

    const interval = setInterval(() => {
      fetchMetrics();
      fetchRealtimeData();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, fetchMetrics, fetchRealtimeData]);

  // Toggle monitoring
  const toggleMonitoring = async () => {
    try {
      const action = isMonitoring ? 'stop_monitoring' : 'start_monitoring';
      const response = await fetch('/api/monitoring/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        setIsMonitoring(!isMonitoring);
      }
    } catch (err) {
      console.error('Error toggling monitoring:', err);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <XCircle className="h-5 w-5 mr-2" />
              Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMetrics} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🚀 Ultra Performance Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring for HOOATS 15K+ TPS system</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            onClick={toggleMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>
      </div>

      {!metrics ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-pulse mx-auto mb-2 text-blue-500" />
            <p>Loading performance metrics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.systemTPS.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Current TPS</div>
                  <Progress 
                    value={metrics.targets.tpsAchievement} 
                    className="mt-2 h-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.targets.tpsAchievement}% of 15K target
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.peakTPS.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Peak TPS</div>
                  <div className="text-xs text-gray-500 mt-3">
                    All-time maximum
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {metrics.averageLatency}ms
                  </div>
                  <div className="text-sm text-gray-600">Avg Latency</div>
                  <div className={`text-xs mt-3 ${metrics.targets.latencyAchievement ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.targets.latencyAchievement ? '✅ Target met' : '❌ Above target'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.uptime}
                  </div>
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="flex justify-center mt-3">
                    <StatusBadge status={metrics.status} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TPS Achievement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                15K+ TPS Target Progress
              </CardTitle>
              <CardDescription>
                Current achievement: {metrics.targets.tpsAchievement}% of 15,000 TPS target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current TPS: {metrics.systemTPS.toLocaleString()}</span>
                    <span>Target: 15,000 TPS</span>
                  </div>
                  <Progress 
                    value={Math.min(metrics.targets.tpsAchievement, 100)} 
                    className="h-4"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-800">
                      {metrics.targets.tpsAchievement >= 100 ? '🎉' : '📈'} Progress
                    </div>
                    <div className="text-green-600">
                      {metrics.targets.tpsAchievement.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-800">⚡ Peak Performance</div>
                    <div className="text-blue-600">
                      {((metrics.peakTPS / 15000) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-800">🎯 Gap to Target</div>
                    <div className="text-purple-600">
                      {(15000 - metrics.systemTPS).toLocaleString()} TPS
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Component Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.componentHealth.map((component) => (
                  <div 
                    key={component.name}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {component.name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <StatusBadge status={component.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">TPS:</span>
                        <div className="font-semibold">{component.tps}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Latency:</span>
                        <div className="font-semibold">{component.latency}ms</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Data */}
          {realtimeData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Real-time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Database className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-lg font-semibold">{realtimeData.activeOrders}</div>
                    <div className="text-sm text-gray-600">Active Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-lg font-semibold">{realtimeData.queuedSettlements}</div>
                    <div className="text-sm text-gray-600">Queued Settlements</div>
                  </div>
                  
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-lg font-semibold">{realtimeData.connectedUsers}</div>
                    <div className="text-sm text-gray-600">Connected Users</div>
                  </div>
                  
                  <div className="text-center">
                    <MemoryStick className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-lg font-semibold">{realtimeData.memoryUsage}MB</div>
                    <div className="text-sm text-gray-600">Memory Usage</div>
                  </div>
                  
                  <div className="text-center">
                    <Cpu className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <div className="text-lg font-semibold">{realtimeData.cpuUsage}%</div>
                    <div className="text-sm text-gray-600">CPU Usage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>15K+ TPS Target Achievement</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.targets.tpsAchievement} className="w-32 h-2" />
                    <span className="text-sm font-medium">{metrics.targets.tpsAchievement}%</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    {metrics.targets.latencyAchievement ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span>Latency Target</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {metrics.targets.uptimeAchievement ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span>Uptime Target</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {metrics.targets.errorRateAchievement ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                    <span>Error Rate Target</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {metrics.status === 'healthy' ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    }
                    <span>System Health</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}