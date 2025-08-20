/**
 * 개선된 Rate Limiter
 * Rate Limiting(요청 제한)과 Order Management(주문 관리)를 명확히 분리
 */
// 주문 타입 (실제 거래소 표준)
export var OrderTimeInForce;
(function (OrderTimeInForce) {
    OrderTimeInForce["GTC"] = "GTC";
    OrderTimeInForce["IOC"] = "IOC";
    OrderTimeInForce["FOK"] = "FOK";
    OrderTimeInForce["GTT"] = "GTT";
    OrderTimeInForce["DAY"] = "DAY";
    OrderTimeInForce["POST"] = "POST"; // Post Only - 메이커 주문만
})(OrderTimeInForce || (OrderTimeInForce = {}));
export class ImprovedRateLimiter {
    // Rate Limiting은 API 요청 횟수만 관리
    requestCounts = new Map();
    // 주문은 별도로 관리
    activeOrders = new Map();
    /**
     * Rate Limiting 체크 (API 요청 제한)
     * 이것은 주문 내용과 무관하게 순수 요청 횟수만 체크
     */
    checkRateLimit(userId) {
        const now = Date.now();
        const requests = this.requestCounts.get(userId) || [];
        // 1분 윈도우에서 1분 이상 지난 요청만 제거
        const recentRequests = requests.filter(timestamp => {
            return now - timestamp < 60000; // 1분 이내 요청만 유지
        });
        // 사용자 티어별 제한 적용
        const userTier = this.getUserTier(userId);
        const limits = this.getLimitsForTier(userTier);
        if (recentRequests.length >= limits.requestsPerMinute) {
            console.log(`Rate limit exceeded for ${userId}: ${recentRequests.length}/${limits.requestsPerMinute}`);
            return false;
        }
        recentRequests.push(now);
        this.requestCounts.set(userId, recentRequests);
        return true;
    }
    /**
     * 주문 생명주기 관리 (Rate Limiting과 별개)
     */
    manageOrderLifecycle(order) {
        const userId = order.userId;
        const orders = this.activeOrders.get(userId) || [];
        // TimeInForce에 따른 주문 만료 처리
        switch (order.timeInForce) {
            case OrderTimeInForce.GTC:
                // 취소할 때까지 유지 (30일 최대)
                order.expiryTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
                break;
            case OrderTimeInForce.IOC:
                // 즉시 처리 후 삭제
                order.expiryTime = Date.now() + 100; // 100ms
                break;
            case OrderTimeInForce.FOK:
                // 전량 체결 안되면 즉시 취소
                order.expiryTime = Date.now() + 100; // 100ms
                break;
            case OrderTimeInForce.GTT:
                // 사용자가 지정한 시간까지
                order.expiryTime = order.customExpiryTime || Date.now() + (60 * 60 * 1000);
                break;
            case OrderTimeInForce.DAY:
                // 오늘 자정까지
                const tomorrow = new Date();
                tomorrow.setHours(24, 0, 0, 0);
                order.expiryTime = tomorrow.getTime();
                break;
            case OrderTimeInForce.POST:
                // GTC와 동일하나 테이커 주문 방지
                order.expiryTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
                order.postOnly = true;
                break;
        }
        orders.push(order);
        this.activeOrders.set(userId, orders);
    }
    /**
     * 만료된 주문 정리 (Rate Limiting과 무관)
     */
    cleanupExpiredOrders() {
        const now = Date.now();
        for (const [userId, orders] of this.activeOrders.entries()) {
            const activeOrders = orders.filter(order => {
                if (order.expiryTime && order.expiryTime < now) {
                    console.log(`Order ${order.id} expired (${order.timeInForce})`);
                    this.cancelOrder(order);
                    return false;
                }
                return true;
            });
            this.activeOrders.set(userId, activeOrders);
        }
    }
    /**
     * Rate Limiting 윈도우 정리 (주문과 무관)
     */
    cleanupRateLimitWindows() {
        const now = Date.now();
        // 5분 이상 지난 윈도우 삭제
        for (const [userId, timestamps] of this.requestCounts.entries()) {
            const recent = timestamps.filter(t => now - t < 300000); // 5분
            if (recent.length === 0) {
                this.requestCounts.delete(userId);
            }
            else {
                this.requestCounts.set(userId, recent);
            }
        }
    }
    getUserTier(userId) {
        // 사용자 티어 조회 로직
        return 'retail';
    }
    getLimitsForTier(tier) {
        const limits = {
            retail: { requestsPerMinute: 100 },
            pro: { requestsPerMinute: 500 },
            marketMaker: { requestsPerMinute: 2000 }
        };
        return limits[tier] || limits.retail;
    }
    cancelOrder(order) {
        // 주문 취소 처리
        console.log(`Cancelling order ${order.id} - ${order.timeInForce}`);
    }
}
