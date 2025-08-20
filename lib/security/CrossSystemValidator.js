/**
 * Cross-System Validation
 * Off-chain orderbook과 On-chain 상태 간 검증 시스템
 */
import { createHash } from 'crypto';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { ethers } from 'ethers';
export class CrossSystemValidator extends EventEmitter {
    redis;
    provider;
    contract;
    // Validation state
    snapshots = new Map();
    validatedProofs = new Set();
    balanceCache = new Map();
    // Monitoring
    validationStats = {
        totalValidations: 0,
        successfulValidations: 0,
        failedValidations: 0,
        discrepanciesFound: 0,
        avgValidationTime: 0
    };
    // Configuration
    SNAPSHOT_INTERVAL = 50; // 50 블록마다 스냅샷
    VALIDATION_TIMEOUT = 5000; // 5초 타임아웃
    BALANCE_CACHE_TTL = 30000; // 30초 캐시
    MAX_DISCREPANCY_THRESHOLD = 0.01; // 1% 허용 오차
    constructor(contractAddress, providerUrl) {
        super();
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
            enableAutoPipelining: true,
            lazyConnect: true, // Enable lazy connect to prevent immediate failures
            enableOfflineQueue: true // Enable offline queue for better error handling
        });
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        // Contract interface (간단화)
        const abi = [
            "function validateOrderProof(bytes32 merkleRoot, bytes32[] calldata proof, bytes calldata orderData) external view returns (bool)",
            "function getSystemSnapshot(uint256 blockNumber) external view returns (bytes32 merkleRoot, uint256 orderCount, uint256 totalVolume)",
            "function balanceOf(address account) external view returns (uint256)",
            "event OrderValidated(bytes32 indexed orderId, address indexed user, uint256 timestamp)",
            "event DiscrepancyDetected(string indexed discrepancyType, uint256 severity, uint256 timestamp)"
        ];
        this.contract = new ethers.Contract(contractAddress, abi, this.provider);
        this.startValidationProcess();
        this.startDiscrepancyMonitoring();
        this.startStatsCollection();
    }
    /**
     * 주문 실행 전 검증
     */
    async validateOrderExecution(orderId, orderData, proof) {
        const startTime = Date.now();
        try {
            // 1. 중복 검증 방지
            if (this.validatedProofs.has(orderId)) {
                return {
                    isValid: false,
                    reason: 'Order already validated',
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            // 2. Merkle proof 검증
            const merkleValidation = await this.validateMerkleProof(proof);
            if (!merkleValidation.isValid) {
                return merkleValidation;
            }
            // 3. 주문 데이터 무결성 검증
            const dataValidation = this.validateOrderData(orderData, proof);
            if (!dataValidation.isValid) {
                return dataValidation;
            }
            // 4. 사용자 잔고 검증
            const balanceValidation = await this.validateUserBalance(orderData.userId, orderData.pair, orderData.amount, orderData.side);
            if (!balanceValidation.isValid) {
                return balanceValidation;
            }
            // 5. 가격 검증 (시장 가격과 비교)
            const priceValidation = await this.validateOrderPrice(orderData.pair, orderData.price);
            if (!priceValidation.isValid) {
                return priceValidation;
            }
            // 검증 성공
            this.validatedProofs.add(orderId);
            this.validationStats.successfulValidations++;
            const validationTime = Date.now() - startTime;
            this.updateValidationMetrics(validationTime);
            console.log(`✅ Order validated: ${orderId} (${validationTime}ms)`);
            return {
                isValid: true,
                confidence: 1.0,
                timestamp: Date.now()
            };
        }
        catch (error) {
            this.validationStats.failedValidations++;
            const validationTime = Date.now() - startTime;
            this.updateValidationMetrics(validationTime);
            console.error(`❌ Validation failed for ${orderId}:`, error);
            return {
                isValid: false,
                reason: `Validation error: ${error.message}`,
                confidence: 0.0,
                timestamp: Date.now()
            };
        }
    }
    /**
     * Merkle Proof 검증
     */
    async validateMerkleProof(proof) {
        try {
            // 현재 블록의 Merkle root 가져오기
            const currentBlock = await this.provider.getBlockNumber();
            const snapshotBlock = Math.floor(currentBlock / this.SNAPSHOT_INTERVAL) * this.SNAPSHOT_INTERVAL;
            let snapshot = this.snapshots.get(snapshotBlock);
            if (!snapshot) {
                snapshot = await this.fetchSystemSnapshot(snapshotBlock);
            }
            // 스마트 컨트랙트에서 검증
            const isValid = await this.contract.validateOrderProof(snapshot.merkleRoot, proof.merkleProof, ethers.getBytes(ethers.toUtf8Bytes(JSON.stringify(proof.orderData))));
            if (!isValid) {
                return {
                    isValid: false,
                    reason: 'Invalid Merkle proof',
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            // 로컬 검증도 수행
            const localValidation = this.verifyMerkleProofLocally(proof.orderId, proof.merkleProof, snapshot.merkleRoot);
            if (!localValidation) {
                return {
                    isValid: false,
                    reason: 'Local Merkle proof verification failed',
                    confidence: 0.8,
                    timestamp: Date.now()
                };
            }
            return {
                isValid: true,
                confidence: 1.0,
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                isValid: false,
                reason: `Merkle proof validation error: ${error.message}`,
                confidence: 0.0,
                timestamp: Date.now()
            };
        }
    }
    /**
     * 주문 데이터 무결성 검증
     */
    validateOrderData(orderData, proof) {
        try {
            // 1. 필수 필드 검증
            const requiredFields = ['userId', 'pair', 'side', 'amount', 'price', 'timestamp'];
            for (const field of requiredFields) {
                if (!orderData[field]) {
                    return {
                        isValid: false,
                        reason: `Missing required field: ${field}`,
                        confidence: 1.0,
                        timestamp: Date.now()
                    };
                }
            }
            // 2. 데이터 타입 검증
            const amount = parseFloat(orderData.amount);
            const price = parseFloat(orderData.price);
            if (isNaN(amount) || amount <= 0) {
                return {
                    isValid: false,
                    reason: 'Invalid amount',
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            if (isNaN(price) || price <= 0) {
                return {
                    isValid: false,
                    reason: 'Invalid price',
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            // 3. 주문 해시 검증
            const calculatedHash = this.calculateOrderHash(orderData);
            if (calculatedHash !== proof.orderId) {
                return {
                    isValid: false,
                    reason: 'Order hash mismatch',
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            // 4. 타임스탬프 검증
            const now = Date.now();
            const orderAge = now - orderData.timestamp;
            if (orderAge > 300000) { // 5분 이상 된 주문
                return {
                    isValid: false,
                    reason: 'Order too old',
                    confidence: 0.9,
                    timestamp: Date.now()
                };
            }
            return {
                isValid: true,
                confidence: 1.0,
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                isValid: false,
                reason: `Order data validation error: ${error.message}`,
                confidence: 0.0,
                timestamp: Date.now()
            };
        }
    }
    /**
     * 사용자 잔고 검증 (Off-chain vs On-chain)
     */
    async validateUserBalance(userId, pair, amount, side) {
        try {
            // 필요한 토큰 주소 추출
            const [baseToken, quoteToken] = pair.split('-');
            const requiredToken = side === 'buy' ? quoteToken : baseToken;
            const requiredAmount = side === 'buy'
                ? parseFloat(amount) * parseFloat('1') // 간단화: price를 1로 가정
                : parseFloat(amount);
            // Off-chain 잔고 조회
            const offChainBalance = await this.getOffChainBalance(userId, requiredToken);
            // On-chain 잔고 조회 (캐시된 값 사용)
            const onChainBalance = await this.getOnChainBalance(userId, requiredToken);
            // 잔고 비교
            const discrepancy = Math.abs(offChainBalance - onChainBalance) / Math.max(offChainBalance, onChainBalance);
            if (discrepancy > this.MAX_DISCREPANCY_THRESHOLD) {
                await this.reportDiscrepancy({
                    type: 'balance',
                    severity: 'high',
                    description: `Balance mismatch for ${userId}:${requiredToken}`,
                    offChainValue: offChainBalance,
                    onChainValue: onChainBalance,
                    difference: discrepancy,
                    timestamp: Date.now()
                });
                return {
                    isValid: false,
                    reason: `Balance discrepancy: ${(discrepancy * 100).toFixed(2)}%`,
                    confidence: 0.8,
                    timestamp: Date.now()
                };
            }
            // 잔고 충분성 검증
            const availableBalance = Math.min(offChainBalance, onChainBalance);
            if (availableBalance < requiredAmount) {
                return {
                    isValid: false,
                    reason: `Insufficient balance: ${availableBalance} < ${requiredAmount}`,
                    confidence: 1.0,
                    timestamp: Date.now()
                };
            }
            return {
                isValid: true,
                confidence: 1.0,
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                isValid: false,
                reason: `Balance validation error: ${error.message}`,
                confidence: 0.0,
                timestamp: Date.now()
            };
        }
    }
    /**
     * 주문 가격 검증 (시장 가격 대비)
     */
    async validateOrderPrice(pair, orderPrice) {
        try {
            // 현재 시장 가격 조회
            const marketPrices = await this.getMarketPrices(pair);
            const price = parseFloat(orderPrice);
            if (!marketPrices) {
                return {
                    isValid: true, // 시장 가격이 없으면 통과
                    confidence: 0.5,
                    timestamp: Date.now()
                };
            }
            // 가격 편차 확인 (±50% 이내)
            const maxAllowedDeviation = 0.5;
            const midPrice = (marketPrices.bid + marketPrices.ask) / 2;
            const deviation = Math.abs(price - midPrice) / midPrice;
            if (deviation > maxAllowedDeviation) {
                return {
                    isValid: false,
                    reason: `Price too far from market: ${(deviation * 100).toFixed(2)}% deviation`,
                    confidence: 0.9,
                    timestamp: Date.now()
                };
            }
            return {
                isValid: true,
                confidence: 1.0,
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                isValid: true, // 가격 검증 실패시 통과 (보수적)
                reason: `Price validation error: ${error.message}`,
                confidence: 0.0,
                timestamp: Date.now()
            };
        }
    }
    /**
     * 시스템 스냅샷 생성
     */
    async createSystemSnapshot() {
        const blockNumber = await this.provider.getBlockNumber();
        // Off-chain 데이터 수집
        const orderCount = await this.redis.zcard('active_orders');
        const totalVolumeStr = await this.redis.get('total_volume') || '0';
        // Merkle root 계산
        const activeOrders = await this.redis.zrange('active_orders', 0, -1);
        const merkleRoot = this.calculateMerkleRoot(activeOrders);
        const snapshot = {
            blockNumber,
            merkleRoot,
            orderCount,
            totalVolume: totalVolumeStr,
            timestamp: Date.now(),
            sequencer: 'current_sequencer', // 실제 구현에서는 현재 시퀀서 주소
            signature: '' // 시퀀서 서명 필요
        };
        // 저장
        this.snapshots.set(blockNumber, snapshot);
        await this.redis.setex(`snapshot:${blockNumber}`, 86400, // 24시간
        JSON.stringify(snapshot));
        return snapshot;
    }
    /**
     * 시스템 스냅샷 페치
     */
    async fetchSystemSnapshot(blockNumber) {
        // Redis에서 먼저 확인
        const cachedSnapshot = await this.redis.get(`snapshot:${blockNumber}`);
        if (cachedSnapshot) {
            const snapshot = JSON.parse(cachedSnapshot);
            this.snapshots.set(blockNumber, snapshot);
            return snapshot;
        }
        // On-chain에서 조회
        try {
            const [merkleRoot, orderCount, totalVolume] = await this.contract.getSystemSnapshot(blockNumber);
            const snapshot = {
                blockNumber,
                merkleRoot,
                orderCount: orderCount.toNumber(),
                totalVolume: totalVolume.toString(),
                timestamp: Date.now(),
                sequencer: '',
                signature: ''
            };
            this.snapshots.set(blockNumber, snapshot);
            return snapshot;
        }
        catch (error) {
            throw new Error(`Failed to fetch system snapshot for block ${blockNumber}: ${error.message}`);
        }
    }
    /**
     * Off-chain 잔고 조회
     */
    async getOffChainBalance(userId, token) {
        const balanceStr = await this.redis.get(`balance:${userId}:${token}`) || '0';
        return parseFloat(balanceStr);
    }
    /**
     * On-chain 잔고 조회 (캐시된)
     */
    async getOnChainBalance(userId, token) {
        const cacheKey = `${userId}:${token}`;
        const cached = this.balanceCache.get(cacheKey);
        // 캐시 유효성 확인
        if (cached && (Date.now() - cached.lastUpdate) < this.BALANCE_CACHE_TTL) {
            return parseFloat(cached.balance);
        }
        // On-chain 조회
        try {
            const balance = await this.contract.balanceOf(userId);
            const balanceStr = ethers.formatEther(balance);
            // 캐시 업데이트
            this.balanceCache.set(cacheKey, {
                balance: balanceStr,
                lastUpdate: Date.now()
            });
            return parseFloat(balanceStr);
        }
        catch (error) {
            console.warn(`Failed to fetch on-chain balance for ${userId}:${token}:`, error);
            return cached ? parseFloat(cached.balance) : 0;
        }
    }
    /**
     * 시장 가격 조회
     */
    async getMarketPrices(pair) {
        try {
            const bidStr = await this.redis.get(`market:${pair}:bid`);
            const askStr = await this.redis.get(`market:${pair}:ask`);
            if (!bidStr || !askStr)
                return null;
            return {
                bid: parseFloat(bidStr),
                ask: parseFloat(askStr)
            };
        }
        catch {
            return null;
        }
    }
    /**
     * 불일치 리포트
     */
    async reportDiscrepancy(discrepancy) {
        this.validationStats.discrepanciesFound++;
        // Redis에 저장
        await this.redis.zadd('discrepancies', Date.now(), JSON.stringify(discrepancy));
        // 심각한 불일치는 즉시 알림
        if (discrepancy.severity === 'critical' || discrepancy.severity === 'high') {
            console.error('🚨 Critical discrepancy detected:', discrepancy);
            this.emit('discrepancy', discrepancy);
        }
        // On-chain 이벤트 발생 (필요시)
        if (discrepancy.severity === 'critical') {
            // 실제 구현에서는 스마트 컨트랙트 호출
            console.warn('Would emit on-chain discrepancy event');
        }
    }
    /**
     * Helper Methods
     */
    calculateOrderHash(orderData) {
        return createHash('sha256')
            .update(JSON.stringify(orderData))
            .digest('hex');
    }
    calculateMerkleRoot(orders) {
        if (orders.length === 0)
            return '';
        const hashes = orders.map(order => createHash('sha256').update(order).digest('hex'));
        return createHash('sha256')
            .update(hashes.sort().join(''))
            .digest('hex');
    }
    verifyMerkleProofLocally(orderId, proof, root) {
        let hash = createHash('sha256').update(orderId).digest('hex');
        for (const proofElement of proof) {
            if (hash < proofElement) {
                hash = createHash('sha256').update(hash + proofElement).digest('hex');
            }
            else {
                hash = createHash('sha256').update(proofElement + hash).digest('hex');
            }
        }
        return hash === root;
    }
    updateValidationMetrics(validationTime) {
        this.validationStats.totalValidations++;
        this.validationStats.avgValidationTime =
            (this.validationStats.avgValidationTime + validationTime) / 2;
    }
    /**
     * 프로세스 시작
     */
    startValidationProcess() {
        console.log('🔍 Cross-system validation started');
        // 주기적 스냅샷 생성
        setInterval(async () => {
            try {
                await this.createSystemSnapshot();
            }
            catch (error) {
                console.error('Failed to create system snapshot:', error);
            }
        }, 60000); // 1분마다
    }
    startDiscrepancyMonitoring() {
        // 주기적 불일치 모니터링
        setInterval(async () => {
            await this.performRoutineChecks();
        }, 30000); // 30초마다
    }
    async performRoutineChecks() {
        // 최근 거래량 비교
        const offChainVolume = await this.redis.get('daily_volume') || '0';
        const onChainVolume = '0'; // 실제로는 on-chain에서 조회
        const volumeDiff = Math.abs(parseFloat(offChainVolume) - parseFloat(onChainVolume));
        if (volumeDiff > 1000) { // $1000 이상 차이
            await this.reportDiscrepancy({
                type: 'volume',
                severity: 'medium',
                description: 'Daily volume discrepancy',
                offChainValue: offChainVolume,
                onChainValue: onChainVolume,
                difference: volumeDiff,
                timestamp: Date.now()
            });
        }
    }
    startStatsCollection() {
        setInterval(() => {
            console.log('📊 Validation Stats:', {
                total: this.validationStats.totalValidations,
                successful: this.validationStats.successfulValidations,
                failed: this.validationStats.failedValidations,
                successRate: this.validationStats.totalValidations > 0
                    ? `${((this.validationStats.successfulValidations / this.validationStats.totalValidations) * 100).toFixed(1)}%`
                    : '0%',
                avgTime: `${this.validationStats.avgValidationTime.toFixed(0)}ms`,
                discrepancies: this.validationStats.discrepanciesFound
            });
        }, 60000); // 1분마다
    }
    /**
     * 통계 반환
     */
    getValidationStats() {
        return {
            ...this.validationStats,
            successRate: this.validationStats.totalValidations > 0
                ? (this.validationStats.successfulValidations / this.validationStats.totalValidations) * 100
                : 0,
            activeSnapshots: this.snapshots.size,
            validatedProofs: this.validatedProofs.size,
            cachedBalances: this.balanceCache.size
        };
    }
    /**
     * 시스템 종료
     */
    async shutdown() {
        console.log('🛑 Shutting down Cross-System Validator...');
        await this.redis.quit();
        console.log('✅ Cross-System Validator shutdown complete');
    }
}
