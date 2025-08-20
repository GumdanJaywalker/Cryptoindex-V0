// lib/security/privy-events.ts
// Enhanced security logging using Privy's security events
import { auditLogger } from './audit-logger';
export class PrivyEventProcessor {
    static instance;
    static getInstance() {
        if (!PrivyEventProcessor.instance) {
            PrivyEventProcessor.instance = new PrivyEventProcessor();
        }
        return PrivyEventProcessor.instance;
    }
    /**
     * Process Privy webhook events
     */
    async processWebhookEvent(webhookEvent) {
        try {
            console.log(`📡 Processing Privy event: ${webhookEvent.event_type}`);
            const securityEvent = this.mapPrivyEventToSecurityEvent(webhookEvent);
            if (securityEvent) {
                await this.processSecurityEvent(securityEvent);
            }
            // Log all Privy events for audit trail
            await auditLogger.logSystem({
                action: 'privy_webhook_processed',
                severity: 'info',
                outcome: 'success',
                additionalData: {
                    eventType: webhookEvent.event_type,
                    eventId: webhookEvent.id,
                    appId: webhookEvent.app_id,
                    timestamp: webhookEvent.created_at
                }
            });
        }
        catch (error) {
            console.error('❌ Failed to process Privy webhook event:', error);
            await auditLogger.logSystem({
                action: 'privy_webhook_error',
                severity: 'error',
                outcome: 'failure',
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                additionalData: {
                    eventType: webhookEvent.event_type,
                    eventId: webhookEvent.id
                }
            });
        }
    }
    /**
     * Map Privy webhook events to our security event format
     */
    mapPrivyEventToSecurityEvent(webhookEvent) {
        const { event_type, data } = webhookEvent;
        const baseEvent = {
            eventType: event_type,
            userId: data.user?.id || data.user_id || 'unknown',
            timestamp: new Date(webhookEvent.created_at),
            metadata: data,
            ipAddress: data.request?.ip_address,
            userAgent: data.request?.user_agent,
            location: data.location,
            device: data.device
        };
        switch (event_type) {
            case 'user.login_succeeded':
                return {
                    ...baseEvent,
                    riskLevel: this.calculateLoginRiskLevel(data)
                };
            case 'user.login_failed':
                return {
                    ...baseEvent,
                    riskLevel: 'medium'
                };
            case 'user.mfa_enabled':
                return {
                    ...baseEvent,
                    riskLevel: 'low'
                };
            case 'user.mfa_disabled':
                return {
                    ...baseEvent,
                    riskLevel: 'high'
                };
            case 'user.wallet_linked':
                return {
                    ...baseEvent,
                    riskLevel: this.calculateWalletLinkingRiskLevel(data)
                };
            case 'user.wallet_unlinked':
                return {
                    ...baseEvent,
                    riskLevel: 'medium'
                };
            case 'user.suspicious_activity':
                return {
                    ...baseEvent,
                    riskLevel: 'critical'
                };
            case 'user.account_recovery_initiated':
                return {
                    ...baseEvent,
                    riskLevel: 'high'
                };
            case 'user.password_reset':
                return {
                    ...baseEvent,
                    riskLevel: 'medium'
                };
            default:
                // For unknown events, still create a security event for logging
                return {
                    ...baseEvent,
                    riskLevel: 'low'
                };
        }
    }
    /**
     * Process security events and take appropriate actions
     */
    async processSecurityEvent(event) {
        try {
            // Log to our audit system
            await this.logSecurityEvent(event);
            // Take action based on risk level
            switch (event.riskLevel) {
                case 'critical':
                    await this.handleCriticalEvent(event);
                    break;
                case 'high':
                    await this.handleHighRiskEvent(event);
                    break;
                case 'medium':
                    await this.handleMediumRiskEvent(event);
                    break;
                case 'low':
                    await this.handleLowRiskEvent(event);
                    break;
            }
            // Update user risk profile
            await this.updateUserRiskProfile(event);
        }
        catch (error) {
            console.error('❌ Failed to process security event:', error);
        }
    }
    /**
     * Log security event to our audit system
     */
    async logSecurityEvent(event) {
        const severity = this.mapRiskLevelToSeverity(event.riskLevel);
        await auditLogger.logSecurity({
            action: `privy_${event.eventType}`,
            severity,
            outcome: 'success',
            userId: event.userId,
            ipAddress: event.ipAddress,
            deviceFingerprint: event.device ? JSON.stringify(event.device) : undefined,
            riskScore: this.mapRiskLevelToScore(event.riskLevel),
            additionalData: {
                privyEventType: event.eventType,
                location: event.location,
                device: event.device,
                metadata: event.metadata,
                riskLevel: event.riskLevel
            }
        });
    }
    /**
     * Handle critical security events
     */
    async handleCriticalEvent(event) {
        console.log(`🚨 CRITICAL security event: ${event.eventType} for user ${event.userId}`);
        // Immediately flag user for review
        await this.flagUserForReview(event.userId, 'critical_security_event', event);
        // Send immediate alerts
        await this.sendSecurityAlert(event, 'critical');
        // Consider temporary restrictions
        if (event.eventType === 'user.suspicious_activity') {
            await this.applyTemporaryRestrictions(event.userId);
        }
    }
    /**
     * Handle high-risk security events
     */
    async handleHighRiskEvent(event) {
        console.log(`⚠️ HIGH RISK security event: ${event.eventType} for user ${event.userId}`);
        // Require additional verification for sensitive operations
        await this.requireAdditionalVerification(event.userId, '24h');
        // Send security notification
        await this.sendSecurityAlert(event, 'high');
        // Update user security settings if needed
        if (event.eventType === 'user.mfa_disabled') {
            await this.recommendMfaReenablement(event.userId);
        }
    }
    /**
     * Handle medium-risk security events
     */
    async handleMediumRiskEvent(event) {
        console.log(`⚠️ Medium risk security event: ${event.eventType} for user ${event.userId}`);
        // Log for monitoring
        await this.updateSecurityMonitoring(event);
        // Send notification if configured
        if (this.shouldNotifyUser(event)) {
            await this.sendSecurityNotification(event.userId, event);
        }
    }
    /**
     * Handle low-risk security events
     */
    async handleLowRiskEvent(event) {
        // Just log for audit trail - no immediate action needed
        console.log(`ℹ️ Low risk security event: ${event.eventType} for user ${event.userId}`);
    }
    /**
     * Calculate risk level for login events
     */
    calculateLoginRiskLevel(data) {
        let riskScore = 0;
        // Check for suspicious patterns
        if (data.location?.country && this.isHighRiskCountry(data.location.country)) {
            riskScore += 30;
        }
        if (data.device?.type === 'unknown' || !data.device) {
            riskScore += 20;
        }
        if (data.is_new_device) {
            riskScore += 25;
        }
        if (data.is_tor || data.is_vpn) {
            riskScore += 40;
        }
        if (data.failed_attempts_today > 3) {
            riskScore += 35;
        }
        // Map score to risk level
        if (riskScore >= 80)
            return 'critical';
        if (riskScore >= 60)
            return 'high';
        if (riskScore >= 30)
            return 'medium';
        return 'low';
    }
    /**
     * Calculate risk level for wallet linking events
     */
    calculateWalletLinkingRiskLevel(data) {
        let riskScore = 0;
        // Check wallet risk factors
        if (data.wallet?.is_flagged) {
            riskScore += 60;
        }
        if (data.wallet?.transaction_count < 10) {
            riskScore += 20; // New wallet
        }
        if (data.wallet?.has_large_transactions) {
            riskScore += 15;
        }
        if (data.is_new_device || data.location_changed) {
            riskScore += 25;
        }
        // Map score to risk level
        if (riskScore >= 70)
            return 'critical';
        if (riskScore >= 50)
            return 'high';
        if (riskScore >= 25)
            return 'medium';
        return 'low';
    }
    // Helper methods
    mapRiskLevelToSeverity(riskLevel) {
        switch (riskLevel) {
            case 'critical': return 'critical';
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'debug';
        }
    }
    mapRiskLevelToScore(riskLevel) {
        switch (riskLevel) {
            case 'critical': return 90;
            case 'high': return 70;
            case 'medium': return 50;
            case 'low': return 20;
            default: return 0;
        }
    }
    isHighRiskCountry(country) {
        // List of countries that might require additional scrutiny
        const highRiskCountries = ['XX', 'YY']; // Replace with actual list
        return highRiskCountries.includes(country);
    }
    shouldNotifyUser(event) {
        // Define when users should be notified
        const notificationEvents = [
            'user.wallet_linked',
            'user.wallet_unlinked',
            'user.mfa_disabled',
            'user.password_reset'
        ];
        return notificationEvents.includes(event.eventType);
    }
    // Placeholder methods for actions (would be implemented based on requirements)
    async flagUserForReview(userId, reason, event) {
        console.log(`🚩 Flagging user ${userId} for review: ${reason}`);
    }
    async sendSecurityAlert(event, priority) {
        console.log(`📢 Sending ${priority} security alert for event: ${event.eventType}`);
    }
    async applyTemporaryRestrictions(userId) {
        console.log(`🔒 Applying temporary restrictions to user: ${userId}`);
    }
    async requireAdditionalVerification(userId, duration) {
        console.log(`🔐 Requiring additional verification for user ${userId} for ${duration}`);
    }
    async recommendMfaReenablement(userId) {
        console.log(`🔑 Recommending MFA re-enablement for user: ${userId}`);
    }
    async updateSecurityMonitoring(event) {
        console.log(`📊 Updating security monitoring for event: ${event.eventType}`);
    }
    async sendSecurityNotification(userId, event) {
        console.log(`📧 Sending security notification to user ${userId} for event: ${event.eventType}`);
    }
    async updateUserRiskProfile(event) {
        console.log(`📈 Updating risk profile for user: ${event.userId}`);
    }
}
// Export singleton instance
export const privyEventProcessor = PrivyEventProcessor.getInstance();
// Webhook handler for Privy events
export async function handlePrivyWebhook(webhookEvent) {
    await privyEventProcessor.processWebhookEvent(webhookEvent);
}
// Export constants
export const PRIVY_EVENT_TYPES = {
    USER_LOGIN_SUCCEEDED: 'user.login_succeeded',
    USER_LOGIN_FAILED: 'user.login_failed',
    USER_MFA_ENABLED: 'user.mfa_enabled',
    USER_MFA_DISABLED: 'user.mfa_disabled',
    USER_WALLET_LINKED: 'user.wallet_linked',
    USER_WALLET_UNLINKED: 'user.wallet_unlinked',
    USER_SUSPICIOUS_ACTIVITY: 'user.suspicious_activity',
    USER_ACCOUNT_RECOVERY: 'user.account_recovery_initiated',
    USER_PASSWORD_RESET: 'user.password_reset'
};
