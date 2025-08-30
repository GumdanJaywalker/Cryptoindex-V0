/**
 * 🗄️ Real AsyncDBWriter - PostgreSQL Integration
 * 
 * Actual database writes to order_history and trade_history tables
 * High-performance batch processing
 * 
 * Created: 2025-08-22
 */

const { createClient } = require('@supabase/supabase-js');

class AsyncDBWriter {
  static instance = null;
  
  constructor() {
    this.queue = [];
    this.supabase = null;
    this.initialized = false;
    this.processing = false;
    this.metrics = {
      queueLength: 0,
      processedToday: 0,
      totalProcessed: 0,
      errors: 0,
      batchesProcessed: 0,
      lastBatchTime: 0
    };
    
    // Performance settings
    this.BATCH_SIZE = 50;
    this.BATCH_TIMEOUT = 1000; // 1 second
    this.MAX_QUEUE_SIZE = 1000;
    
    this.initializeDatabase();
    this.startBatchProcessor();
  }

  static getInstance() {
    if (!AsyncDBWriter.instance) {
      AsyncDBWriter.instance = new AsyncDBWriter();
    }
    return AsyncDBWriter.instance;
  }

  async initializeDatabase() {
    try {
      console.log('🗄️ Initializing Supabase database connection...');
      
      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase credentials not found, using mock mode');
        return false;
      }
      
      this.supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection
      const { data, error } = await this.supabase
        .from('order_history')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Supabase connection test failed:', error.message);
        return false;
      }
      
      this.initialized = true;
      console.log('✅ Real database connection established');
      
      return true;
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  queueOrderHistory(orderData) {
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      console.warn('⚠️ Queue full, dropping oldest order');
      this.queue.shift();
    }
    
    const record = {
      type: 'order',
      data: {
        id: orderData.id || orderData.redis_order_id,
        user_id: orderData.userId || 'unknown',
        pair: orderData.pair,
        side: orderData.side,
        order_type: orderData.type || 'market',
        price: orderData.price ? parseFloat(orderData.price) : null,
        amount: parseFloat(orderData.amount || '0'),
        filled_amount: parseFloat(orderData.filled_amount || '0'),
        status: orderData.status || 'filled',
        redis_order_id: orderData.redis_order_id || orderData.id,
        created_at: new Date().toISOString()
      },
      timestamp: Date.now(),
      retries: 0
    };
    
    this.queue.push(record);
    this.metrics.queueLength = this.queue.length;
    
    console.log(`📝 REAL DB Queue - Order History: ${record.data.id} (Queue: ${this.queue.length})`);
  }

  queueTradeHistory(tradeData) {
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      console.warn('⚠️ Queue full, dropping oldest trade');
      this.queue.shift();
    }
    
    const record = {
      type: 'trade',
      data: {
        id: tradeData.id,
        pair: tradeData.pair || 'HYPERINDEX-USDC',
        buyer_order_id: tradeData.buyer || tradeData.buyer_order_id,
        seller_order_id: tradeData.seller || tradeData.seller_order_id,
        price: parseFloat(tradeData.price || '0'),
        amount: parseFloat(tradeData.amount || '0'),
        side: tradeData.side || 'buy',
        source: tradeData.source || 'Orderbook',
        buyer_fee: parseFloat(tradeData.buyer_fee || '0'),
        seller_fee: parseFloat(tradeData.seller_fee || '0'),
        price_impact: tradeData.priceImpact ? parseFloat(tradeData.priceImpact) : null,
        amm_reserves_before: tradeData.ammReservesBefore || null,
        amm_reserves_after: tradeData.ammReservesAfter || null,
        redis_trade_id: tradeData.id,
        tx_hash: tradeData.txHash || null,
        block_number: tradeData.blockNumber ? parseInt(tradeData.blockNumber) : null,
        gas_used: tradeData.gasUsed ? parseInt(tradeData.gasUsed) : null,
        executed_at: tradeData.timestamp ? new Date(tradeData.timestamp).toISOString() : new Date().toISOString()
      },
      timestamp: Date.now(),
      retries: 0
    };
    
    this.queue.push(record);
    this.metrics.queueLength = this.queue.length;
    
    console.log(`📝 REAL DB Queue - Trade History: ${record.data.id} (Queue: ${this.queue.length})`);
  }

  async processBatch() {
    if (this.processing || this.queue.length === 0) {
      return;
    }
    
    this.processing = true;
    const startTime = Date.now();
    
    try {
      // Take a batch from the queue
      const batchSize = Math.min(this.BATCH_SIZE, this.queue.length);
      const batch = this.queue.splice(0, batchSize);
      
      console.log(`📦 REAL DB Processing batch: ${batch.length} records`);
      
      // Separate orders and trades
      const orders = batch.filter(item => item.type === 'order').map(item => item.data);
      const trades = batch.filter(item => item.type === 'trade').map(item => item.data);
      
      const results = [];
      
      // Process orders
      if (orders.length > 0 && this.initialized) {
        try {
          const { data, error } = await this.supabase
            .from('order_history')
            .insert(orders)
            .select();
          
          if (error) {
            console.error('❌ Order batch insert failed:', error.message);
            results.push({ type: 'order', success: false, error: error.message });
          } else {
            console.log(`✅ Inserted ${orders.length} orders to database`);
            results.push({ type: 'order', success: true, count: orders.length });
          }
        } catch (error) {
          console.error('❌ Order insert error:', error.message);
          results.push({ type: 'order', success: false, error: error.message });
        }
      }
      
      // Process trades
      if (trades.length > 0 && this.initialized) {
        try {
          const { data, error } = await this.supabase
            .from('trade_history')
            .insert(trades)
            .select();
          
          if (error) {
            console.error('❌ Trade batch insert failed:', error.message);
            results.push({ type: 'trade', success: false, error: error.message });
          } else {
            console.log(`✅ Inserted ${trades.length} trades to database`);
            results.push({ type: 'trade', success: true, count: trades.length });
          }
        } catch (error) {
          console.error('❌ Trade insert error:', error.message);
          results.push({ type: 'trade', success: false, error: error.message });
        }
      }
      
      // Update metrics
      const successfulRecords = results.reduce((sum, r) => sum + (r.success ? r.count || 0 : 0), 0);
      this.metrics.totalProcessed += successfulRecords;
      this.metrics.processedToday += successfulRecords;
      this.metrics.batchesProcessed++;
      this.metrics.lastBatchTime = Date.now() - startTime;
      this.metrics.queueLength = this.queue.length;
      
      if (results.some(r => !r.success)) {
        this.metrics.errors++;
      }
      
      console.log(`📊 REAL DB Batch complete: ${successfulRecords}/${batch.length} records, ${this.metrics.lastBatchTime}ms`);
      
    } catch (error) {
      console.error('❌ Batch processing failed:', error.message);
      this.metrics.errors++;
    } finally {
      this.processing = false;
    }
  }

  startBatchProcessor() {
    // Process batches every second
    setInterval(() => {
      this.processBatch().catch(console.error);
    }, this.BATCH_TIMEOUT);
    
    // Emergency flush if queue gets too large
    setInterval(() => {
      if (this.queue.length > this.MAX_QUEUE_SIZE * 0.8) {
        console.log('🚨 Emergency batch processing - queue getting full');
        this.processBatch().catch(console.error);
      }
    }, 5000);
    
    console.log('🔄 REAL DB batch processor started');
  }

  async forceFlush() {
    console.log('🚀 Force flushing database queue...');
    
    while (this.queue.length > 0 && !this.processing) {
      await this.processBatch();
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Database queue flushed');
  }

  async getRecentTrades(limit = 10) {
    if (!this.initialized) {
      return [];
    }
    
    try {
      const { data, error } = await this.supabase
        .from('trade_history')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('❌ Failed to fetch recent trades:', error.message);
        return [];
      }
      
      return data || [];
      
    } catch (error) {
      console.error('❌ Recent trades query failed:', error.message);
      return [];
    }
  }

  async getOrderStats(timeframe = '24h') {
    if (!this.initialized) {
      return null;
    }
    
    try {
      const hoursAgo = timeframe === '24h' ? 24 : timeframe === '1h' ? 1 : 168; // 7 days
      const sinceTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('order_history')
        .select('status, side, amount')
        .gte('created_at', sinceTime);
      
      if (error) {
        console.error('❌ Failed to fetch order stats:', error.message);
        return null;
      }
      
      const stats = {
        totalOrders: data.length,
        buyOrders: data.filter(o => o.side === 'buy').length,
        sellOrders: data.filter(o => o.side === 'sell').length,
        filledOrders: data.filter(o => o.status === 'filled').length,
        totalVolume: data.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0),
        timeframe
      };
      
      return stats;
      
    } catch (error) {
      console.error('❌ Order stats query failed:', error.message);
      return null;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      initialized: this.initialized,
      processing: this.processing,
      databaseConnected: !!this.supabase,
      realDatabase: true
    };
  }

  async shutdown() {
    console.log('📴 Shutting down Real AsyncDBWriter...');
    
    // Flush remaining queue
    await this.forceFlush();
    
    console.log('✅ Real AsyncDBWriter shutdown complete');
  }
}

module.exports = { AsyncDBWriter };