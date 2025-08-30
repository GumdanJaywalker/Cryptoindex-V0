/**
 * 📊 Business Intelligence Analytics (JavaScript Version)
 * Advanced analytics for HOOATS trading performance and user behavior
 * Provides insights for 15K+ TPS optimization and business metrics
 */

const { EventEmitter } = require('events');
const Redis = require('ioredis');

class BusinessIntelligence extends EventEmitter {
  static instance = null;
  
  constructor() {
    super();
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.isAnalyzing = false;
    this.analysisInterval = null;
    
    this.metrics = this.createDefaultMetrics();
    this.insights = this.createDefaultInsights();
    this.userAnalyses = new Map();
  }

  static getInstance() {
    if (!BusinessIntelligence.instance) {
      BusinessIntelligence.instance = new BusinessIntelligence();
    }
    return BusinessIntelligence.instance;
  }

  /**
   * Start business intelligence analytics
   */
  async startAnalytics() {
    if (this.isAnalyzing) {
      console.log('📊 Business analytics already running');
      return;
    }

    console.log('🚀 Starting Business Intelligence Analytics...');
    this.isAnalyzing = true;

    // Analyze data every 30 seconds for real-time insights
    this.analysisInterval = setInterval(async () => {
      await this.analyzeMetrics();
      await this.generateInsights();
      await this.analyzeUserBehavior();
      this.emit('analytics_updated', {
        metrics: this.metrics,
        insights: this.insights,
        timestamp: Date.now()
      });
    }, 30000);

    // Initial analysis
    await this.analyzeMetrics();
    await this.generateInsights();

    console.log('✅ Business Intelligence Analytics started');
  }

  /**
   * Stop business intelligence analytics
   */
  async stopAnalytics() {
    console.log('🛑 Stopping Business Intelligence Analytics...');
    
    this.isAnalyzing = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    console.log('✅ Business Intelligence Analytics stopped');
  }

  /**
   * Analyze trading metrics
   */
  async analyzeMetrics() {
    try {
      // Get trading data from Redis
      const tradingData = await this.redis.hgetall('analytics:trading');
      const orderData = await this.redis.hgetall('analytics:orders');
      const performanceData = await this.redis.hgetall('analytics:performance');
      const userMetrics = await this.redis.hgetall('analytics:users');
      
      // Update volume metrics
      this.metrics.volume = {
        total: parseFloat(tradingData.totalVolume) || 0,
        byPair: JSON.parse(tradingData.volumeByPair || '{}'),
        byTimeframe: JSON.parse(tradingData.volumeByTimeframe || '{}'),
        growth: parseFloat(tradingData.volumeGrowth) || 0
      };

      // Update order metrics
      this.metrics.orders = {
        total: parseInt(orderData.totalOrders) || 0,
        byType: JSON.parse(orderData.ordersByType || '{}'),
        bySide: JSON.parse(orderData.ordersBySide || '{}'),
        successRate: parseFloat(orderData.successRate) || 100,
        averageSize: parseFloat(orderData.averageOrderSize) || 0
      };

      // Update performance metrics
      this.metrics.performance = {
        tps: parseFloat(performanceData.currentTPS) || 0,
        latency: parseFloat(performanceData.averageLatency) || 0,
        throughput: parseFloat(performanceData.throughput) || 0,
        efficiency: parseFloat(performanceData.efficiency) || 0,
        bottlenecks: JSON.parse(performanceData.bottlenecks || '[]')
      };

      // Update user metrics
      this.metrics.users = {
        active: parseInt(userMetrics.activeUsers) || 0,
        new: parseInt(userMetrics.newUsers) || 0,
        retention: parseFloat(userMetrics.retentionRate) || 0,
        topTraders: JSON.parse(userMetrics.topTraders || '[]')
      };

      // Calculate revenue metrics
      const totalFees = this.metrics.volume.total * 0.001; // 0.1% fee
      this.metrics.revenue = {
        totalFees,
        feesByPair: Object.fromEntries(
          Object.entries(this.metrics.volume.byPair).map(([pair, volume]) => [
            pair, 
            volume * 0.001
          ])
        ),
        projectedDaily: totalFees * 24, // Assuming hourly data
        projectedMonthly: totalFees * 24 * 30
      };

      console.log(`📊 Analytics updated: ${this.metrics.performance.tps} TPS, $${totalFees.toFixed(2)} fees`);

    } catch (error) {
      console.error('❌ Error analyzing metrics:', error);
    }
  }

  /**
   * Generate system insights and recommendations
   */
  async generateInsights() {
    try {
      // TPS Optimization Analysis
      const currentTPS = this.metrics.performance.tps;
      const targetTPS = 15000;
      const theoreticalMax = 25000; // Based on architecture analysis

      const constraints = [];
      const improvements = [];

      // Identify constraints
      if (this.metrics.performance.latency > 100) {
        constraints.push('High latency limiting throughput');
        improvements.push({
          suggestion: 'Optimize database query performance',
          expectedGain: 2000,
          difficulty: 'medium'
        });
      }

      if (this.metrics.performance.bottlenecks.includes('database')) {
        constraints.push('Database bottleneck detected');
        improvements.push({
          suggestion: 'Implement connection pooling and read replicas',
          expectedGain: 5000,
          difficulty: 'high'
        });
      }

      if (currentTPS < targetTPS * 0.3) {
        constraints.push('Batch processing not optimally utilized');
        improvements.push({
          suggestion: 'Increase batch sizes and parallel processing',
          expectedGain: 8000,
          difficulty: 'medium'
        });
      }

      this.insights.tpsOptimization = {
        currentTPS,
        theoreticalMax,
        constraints,
        improvements
      };

      // Resource Utilization Analysis
      this.insights.resourceUtilization = {
        cpu: Math.random() * 100, // Mock data - replace with real metrics
        memory: Math.random() * 100,
        database: Math.random() * 100,
        redis: Math.random() * 100,
        bottlenecks: this.metrics.performance.bottlenecks
      };

      // Predictive Analytics
      this.insights.predictiveAnalytics = {
        volumeForecast: this.generateVolumeForecast(),
        userGrowthForecast: this.generateUserGrowthForecast(),
        systemLoadForecast: this.generateSystemLoadForecast()
      };

      // Generate recommendations
      this.insights.recommendations = {
        infrastructure: this.generateInfrastructureRecommendations(),
        business: this.generateBusinessRecommendations(),
        technical: this.generateTechnicalRecommendations()
      };

    } catch (error) {
      console.error('❌ Error generating insights:', error);
    }
  }

  /**
   * Analyze user behavior patterns
   */
  async analyzeUserBehavior() {
    try {
      // Get top active users
      const activeUserIds = await this.redis.smembers('analytics:active_users');
      
      for (const userId of activeUserIds.slice(0, 100)) { // Analyze top 100 users
        const userAnalysis = await this.analyzeIndividualUser(userId);
        if (userAnalysis) {
          this.userAnalyses.set(userId, userAnalysis);
        }
      }

      console.log(`👥 Analyzed behavior for ${this.userAnalyses.size} users`);

    } catch (error) {
      console.error('❌ Error analyzing user behavior:', error);
    }
  }

  /**
   * Analyze individual user behavior
   */
  async analyzeIndividualUser(userId) {
    try {
      const userData = await this.redis.hgetall(`analytics:user:${userId}`);
      
      if (!userData || Object.keys(userData).length === 0) {
        return null;
      }

      // Analyze trading patterns
      const tradingPatterns = {
        preferredPairs: JSON.parse(userData.preferredPairs || '[]'),
        averageOrderSize: parseFloat(userData.averageOrderSize) || 0,
        tradingFrequency: parseFloat(userData.tradingFrequency) || 0,
        riskProfile: this.determineRiskProfile(userData)
      };

      // Analyze performance
      const performance = {
        totalVolume: parseFloat(userData.totalVolume) || 0,
        totalTrades: parseInt(userData.totalTrades) || 0,
        successRate: parseFloat(userData.successRate) || 0,
        averageProfit: parseFloat(userData.averageProfit) || 0
      };

      // Analyze engagement
      const engagement = {
        sessionsPerDay: parseFloat(userData.sessionsPerDay) || 0,
        averageSessionDuration: parseFloat(userData.averageSessionDuration) || 0,
        lastActive: new Date(userData.lastActive || Date.now()),
        retentionScore: parseFloat(userData.retentionScore) || 0
      };

      // Generate recommendations
      const recommendations = this.generateUserRecommendations(tradingPatterns, performance, engagement);

      return {
        userId,
        tradingPatterns,
        performance,
        engagement,
        recommendations
      };

    } catch (error) {
      console.error(`❌ Error analyzing user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Get current trading metrics
   */
  getTradingMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get system insights
   */
  getSystemInsights() {
    return { ...this.insights };
  }

  /**
   * Get user behavior analysis
   */
  getUserAnalysis(userId) {
    return this.userAnalyses.get(userId) || null;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      metrics: this.metrics,
      insights: this.insights,
      topUsers: Array.from(this.userAnalyses.values()).slice(0, 10),
      lastUpdated: Date.now()
    };
  }

  // Helper methods
  createDefaultMetrics() {
    return {
      volume: { total: 0, byPair: {}, byTimeframe: {}, growth: 0 },
      orders: { total: 0, byType: {}, bySide: {}, successRate: 100, averageSize: 0 },
      performance: { tps: 0, latency: 0, throughput: 0, efficiency: 0, bottlenecks: [] },
      users: { active: 0, new: 0, retention: 0, topTraders: [] },
      revenue: { totalFees: 0, feesByPair: {}, projectedDaily: 0, projectedMonthly: 0 }
    };
  }

  createDefaultInsights() {
    return {
      tpsOptimization: { currentTPS: 0, theoreticalMax: 25000, constraints: [], improvements: [] },
      resourceUtilization: { cpu: 0, memory: 0, database: 0, redis: 0, bottlenecks: [] },
      predictiveAnalytics: { volumeForecast: {}, userGrowthForecast: {}, systemLoadForecast: {} },
      recommendations: { infrastructure: [], business: [], technical: [] }
    };
  }

  determineRiskProfile(userData) {
    const averageOrderSize = parseFloat(userData.averageOrderSize) || 0;
    const tradingFrequency = parseFloat(userData.tradingFrequency) || 0;

    if (averageOrderSize > 1000 && tradingFrequency > 10) {
      return 'aggressive';
    } else if (averageOrderSize > 100 || tradingFrequency > 5) {
      return 'moderate';
    }
    return 'conservative';
  }

  generateVolumeForecast() {
    const currentVolume = this.metrics.volume.total;
    return {
      '1h': currentVolume * 1.05,
      '6h': currentVolume * 1.15,
      '1d': currentVolume * 1.3,
      '1w': currentVolume * 2.5,
      '1m': currentVolume * 8.0
    };
  }

  generateUserGrowthForecast() {
    const currentUsers = this.metrics.users.active;
    return {
      '1d': currentUsers * 1.02,
      '1w': currentUsers * 1.08,
      '1m': currentUsers * 1.25,
      '3m': currentUsers * 1.8,
      '1y': currentUsers * 4.0
    };
  }

  generateSystemLoadForecast() {
    const currentTPS = this.metrics.performance.tps;
    return {
      '1h': currentTPS * 1.1,
      '6h': currentTPS * 1.3,
      '1d': currentTPS * 1.8,
      '1w': currentTPS * 2.5,
      'peak': currentTPS * 4.0
    };
  }

  generateInfrastructureRecommendations() {
    const recommendations = [];
    
    if (this.metrics.performance.tps < 5000) {
      recommendations.push('Scale database infrastructure with read replicas');
    }
    
    if (this.insights.resourceUtilization.redis > 80) {
      recommendations.push('Implement Redis cluster for better performance');
    }
    
    if (this.metrics.users.active > 1000) {
      recommendations.push('Add CDN for static asset delivery');
    }

    return recommendations;
  }

  generateBusinessRecommendations() {
    const recommendations = [];
    
    if (this.metrics.revenue.totalFees < 1000) {
      recommendations.push('Consider promotional campaigns to increase trading volume');
    }
    
    if (this.metrics.users.retention < 70) {
      recommendations.push('Implement user retention programs and rewards');
    }

    return recommendations;
  }

  generateTechnicalRecommendations() {
    const recommendations = [];
    
    if (this.metrics.performance.latency > 100) {
      recommendations.push('Optimize API response times with caching');
    }
    
    if (this.metrics.performance.tps < 15000) {
      recommendations.push('Implement batch processing optimization');
    }

    return recommendations;
  }

  generateUserRecommendations(patterns, performance, engagement) {
    const recommendations = [];

    if (engagement.sessionsPerDay < 1) {
      recommendations.push('Consider educational content to increase engagement');
    }

    if (performance.successRate < 60) {
      recommendations.push('Provide advanced trading tools and analytics');
    }

    if (patterns.averageOrderSize < 10) {
      recommendations.push('Suggest larger position sizing strategies');
    }

    return recommendations;
  }
}

module.exports = { BusinessIntelligence };