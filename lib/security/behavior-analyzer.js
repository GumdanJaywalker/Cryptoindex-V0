// lib/security/behavior-analyzer.ts
import { createClient } from '@supabase/supabase-js';
import { auditLogger } from './audit-logger';
import crypto from 'crypto';
export class BehaviorAnalyzer {
    static instance;
    supabase;
    activeSessions = new Map();
    profileCache = new Map();
    // Analysis configuration
    config = {
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        anomalyThresholds: {
            sessionDurationDeviation: 3, // Standard deviations
            activitySpeedDeviation: 2,
            locationChange: 100, // km
            deviceChange: true,
            unusualHours: 6 // hours outside normal pattern
        },
        mlModelEndpoint: process.env.BEHAVIOR_ML_ENDPOINT,
        enableRealTimeAnalysis: true
    };
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // Start session cleanup timer
        setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000); // Every 5 minutes
    }
    static getInstance() {
        if (!BehaviorAnalyzer.instance) {
            BehaviorAnalyzer.instance = new BehaviorAnalyzer();
        }
        return BehaviorAnalyzer.instance;
    }
    /**
     * Start tracking a user session
     */
    async startSession(userId, sessionId, metadata) {
        try {
            const session = {
                sessionId,
                userId,
                startTime: new Date(),
                ipAddress: metadata.ipAddress,
                userAgent: metadata.userAgent,
                deviceFingerprint: metadata.deviceFingerprint,
                geolocation: metadata.geolocation,
                activities: [],
                riskScore: 0,
                anomalies: []
            };
            this.activeSessions.set(sessionId, session);
            // Load user behavior profile
            const profile = await this.getUserBehaviorProfile(userId);
            // Analyze session start for anomalies
            const startAnomalies = await this.analyzeSessionStart(session, profile);
            session.anomalies.push(...startAnomalies);
            // Log session start
            await auditLogger.logSecurity({
                action: 'session_started',
                severity: 'info',
                outcome: 'success',
                userId,
                ipAddress: metadata.ipAddress,
                deviceFingerprint: metadata.deviceFingerprint,
                additionalData: {
                    sessionId,
                    userAgent: metadata.userAgent,
                    geolocation: metadata.geolocation,
                    anomalies: startAnomalies.length
                }
            });
            console.log(`✅ Started behavior tracking for session: ${sessionId}`);
        }
        catch (error) {
            console.error('❌ Failed to start session tracking:', error);
        }
    }
    /**
     * Track user activity within a session
     */
    async trackActivity(sessionId, activity) {
        try {
            const session = this.activeSessions.get(sessionId);
            if (!session) {
                console.warn(`Session not found: ${sessionId}`);
                return;
            }
            const sessionActivity = {
                timestamp: new Date(),
                ...activity
            };
            session.activities.push(sessionActivity);
            // Real-time anomaly detection
            if (this.config.enableRealTimeAnalysis) {
                const profile = await this.getUserBehaviorProfile(session.userId);
                const anomalies = await this.analyzeActivityAnomalies(session, sessionActivity, profile);
                if (anomalies.length > 0) {
                    session.anomalies.push(...anomalies);
                    await this.handleAnomalies(session, anomalies);
                }
            }
            // Update session risk score
            session.riskScore = this.calculateSessionRiskScore(session);
        }
        catch (error) {
            console.error('❌ Failed to track activity:', error);
        }
    }
    /**
     * End a user session and perform final analysis
     */
    async endSession(sessionId) {
        try {
            const session = this.activeSessions.get(sessionId);
            if (!session) {
                console.warn(`Session not found: ${sessionId}`);
                return;
            }
            session.endTime = new Date();
            // Perform comprehensive session analysis
            const sessionAnalysis = await this.analyzeCompleteSession(session);
            // Save session data
            await this.saveSessionData(session, sessionAnalysis);
            // Update user behavior profile
            await this.updateBehaviorProfile(session);
            // Remove from active sessions
            this.activeSessions.delete(sessionId);
            // Log session end
            await auditLogger.logSecurity({
                action: 'session_ended',
                severity: session.riskScore > 70 ? 'warning' : 'info',
                outcome: 'success',
                userId: session.userId,
                ipAddress: session.ipAddress,
                riskScore: session.riskScore,
                additionalData: {
                    sessionId,
                    duration: session.endTime.getTime() - session.startTime.getTime(),
                    activities: session.activities.length,
                    anomalies: session.anomalies.length,
                    analysis: sessionAnalysis
                }
            });
            console.log(`✅ Ended behavior tracking for session: ${sessionId}`);
        }
        catch (error) {
            console.error('❌ Failed to end session tracking:', error);
        }
    }
    /**
     * Analyze user behavior patterns and generate insights
     */
    async analyzeBehaviorPatterns(userId, timeframe) {
        try {
            // Get user sessions within timeframe
            const sessions = await this.getUserSessions(userId, timeframe);
            // Generate behavior profile
            const profile = await this.generateBehaviorProfile(userId, sessions);
            // Extract insights
            const insights = this.extractBehaviorInsights(profile, sessions);
            // Generate recommendations
            const recommendations = this.generateSecurityRecommendations(profile, insights);
            // Assess overall risk
            const riskAssessment = this.assessUserRisk(profile, sessions);
            return {
                profile,
                insights,
                recommendations,
                riskAssessment
            };
        }
        catch (error) {
            console.error('❌ Failed to analyze behavior patterns:', error);
            throw error;
        }
    }
    /**
     * Detect behavioral anomalies in real-time
     */
    async detectAnomalies(userId, currentActivity) {
        try {
            const profile = await this.getUserBehaviorProfile(userId);
            const alerts = [];
            // Check for various anomaly types
            const anomalyChecks = [
                this.checkTimeBasedAnomalies(currentActivity, profile),
                this.checkLocationAnomalies(currentActivity, profile),
                this.checkDeviceAnomalies(currentActivity, profile),
                this.checkActivitySpeedAnomalies(currentActivity, profile),
                this.checkNavigationAnomalies(currentActivity, profile)
            ];
            const anomalies = await Promise.all(anomalyChecks);
            for (const anomaly of anomalies.flat()) {
                if (anomaly) {
                    const alert = {
                        id: crypto.randomUUID(),
                        userId,
                        alertType: anomaly.type,
                        severity: anomaly.severity,
                        title: this.getAnomalyTitle(anomaly.type),
                        description: anomaly.description,
                        evidence: anomaly.evidence,
                        confidence: anomaly.confidence,
                        status: 'open',
                        createdAt: new Date()
                    };
                    alerts.push(alert);
                    await this.saveAlert(alert);
                }
            }
            return alerts;
        }
        catch (error) {
            console.error('❌ Failed to detect anomalies:', error);
            return [];
        }
    }
    /**
     * Generate ML features for advanced analysis
     */
    async generateMLFeatures(userId) {
        try {
            const profile = await this.getUserBehaviorProfile(userId);
            const recentSessions = await this.getUserSessions(userId, {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                end: new Date()
            });
            const features = {
                // Temporal features
                avg_session_duration: this.calculateAverageSessionDuration(recentSessions),
                session_frequency: recentSessions.length / 30,
                active_hours_entropy: this.calculateEntropyOfActiveHours(profile.activeHours),
                // Activity features
                action_diversity: Object.keys(profile.actionFrequency).length,
                most_common_action_ratio: Math.max(...Object.values(profile.actionFrequency)) / recentSessions.length,
                avg_processing_time: this.calculateAverageProcessingTime(recentSessions),
                // Consistency features
                device_consistency_score: profile.deviceConsistency,
                location_consistency_score: profile.locationConsistency,
                // Risk features
                historical_risk_score: profile.riskScore,
                anomaly_frequency: this.calculateAnomalyFrequency(recentSessions),
                failed_action_ratio: this.calculateFailedActionRatio(recentSessions),
                // Advanced behavioral features
                typing_speed_consistency: this.calculateTypingSpeedConsistency(recentSessions),
                navigation_pattern_uniqueness: this.calculateNavigationUniqueness(profile.navigationPatterns),
                time_between_actions_variance: this.calculateTimeBetweenActionsVariance(recentSessions)
            };
            return features;
        }
        catch (error) {
            console.error('❌ Failed to generate ML features:', error);
            return {};
        }
    }
    // Private helper methods
    async analyzeSessionStart(session, profile) {
        const anomalies = [];
        const currentHour = session.startTime.getHours();
        // Check for unusual login time
        if (!profile.activeHours.includes(currentHour)) {
            const deviation = this.calculateHourDeviation(currentHour, profile.activeHours);
            if (deviation > this.config.anomalyThresholds.unusualHours) {
                anomalies.push({
                    type: 'unusual_login_time',
                    severity: 'medium',
                    description: `Login at unusual hour: ${currentHour}:00`,
                    score: 40,
                    evidence: { currentHour, typicalHours: profile.activeHours },
                    detectedAt: new Date()
                });
            }
        }
        // Check for location anomaly
        if (session.geolocation && profile.locationConsistency > 0.8) {
            // Implementation would check against historical locations
        }
        // Check for device anomaly
        if (session.deviceFingerprint && profile.deviceConsistency > 0.8) {
            // Implementation would check against known devices
        }
        return anomalies;
    }
    async analyzeActivityAnomalies(session, activity, profile) {
        const anomalies = [];
        // Check activity speed
        const recentActivities = session.activities.slice(-5);
        if (recentActivities.length >= 2) {
            const timeBetweenActions = this.calculateTimeBetweenActions(recentActivities);
            const expectedTime = this.getExpectedTimeBetweenActions(activity.action, profile);
            if (timeBetweenActions < expectedTime * 0.1) { // Too fast
                anomalies.push({
                    type: 'suspicious_activity_speed',
                    severity: 'high',
                    description: 'Actions performed unusually fast',
                    score: 70,
                    evidence: { timeBetweenActions, expectedTime },
                    detectedAt: new Date()
                });
            }
        }
        return anomalies;
    }
    async analyzeCompleteSession(session) {
        const duration = session.endTime.getTime() - session.startTime.getTime();
        const activityCount = session.activities.length;
        const anomalyCount = session.anomalies.length;
        return {
            duration,
            activityCount,
            anomalyCount,
            riskScore: session.riskScore,
            suspiciousPatterns: this.identifySuspiciousPatterns(session),
            behaviorClassification: this.classifySessionBehavior(session)
        };
    }
    calculateSessionRiskScore(session) {
        let score = 0;
        // Base score from anomalies
        for (const anomaly of session.anomalies) {
            switch (anomaly.severity) {
                case 'low':
                    score += 10;
                    break;
                case 'medium':
                    score += 25;
                    break;
                case 'high':
                    score += 50;
                    break;
                case 'critical':
                    score += 75;
                    break;
            }
        }
        // Activity pattern scoring
        const failedActions = session.activities.filter(a => a.outcome === 'failure').length;
        const failureRate = failedActions / session.activities.length;
        score += failureRate * 30;
        // Session duration scoring
        const duration = Date.now() - session.startTime.getTime();
        if (duration > 4 * 60 * 60 * 1000) { // More than 4 hours
            score += 20;
        }
        return Math.min(100, score);
    }
    async getUserBehaviorProfile(userId) {
        // Check cache first
        if (this.profileCache.has(userId)) {
            return this.profileCache.get(userId);
        }
        try {
            const { data, error } = await this.supabase
                .from('user_behavior_patterns')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error || !data) {
                return this.getDefaultBehaviorProfile(userId);
            }
            const profile = {
                userId,
                profileType: 'normal',
                activeHours: data.typical_hours || [9, 10, 11, 14, 15, 16, 19, 20],
                sessionDuration: {
                    average: 1800000, // 30 minutes
                    median: 1200000, // 20 minutes
                    std: 600000 // 10 minutes
                },
                actionFrequency: data.ml_features?.actionFrequency || {},
                navigationPatterns: data.ml_features?.navigationPatterns || [],
                typingSpeed: data.ml_features?.typingSpeed || 40,
                deviceConsistency: 0.8,
                locationConsistency: 0.9,
                browserFeatureUsage: {},
                riskScore: data.risk_score || 0,
                riskFactors: data.risk_factors || [],
                lastUpdated: new Date(data.updated_at),
                mlFeatures: data.ml_features || {},
                mlPredictions: []
            };
            // Cache the profile
            this.profileCache.set(userId, profile);
            return profile;
        }
        catch (error) {
            console.error('❌ Failed to get behavior profile:', error);
            return this.getDefaultBehaviorProfile(userId);
        }
    }
    getDefaultBehaviorProfile(userId) {
        return {
            userId,
            profileType: 'normal',
            activeHours: [9, 10, 11, 14, 15, 16, 19, 20],
            sessionDuration: {
                average: 1800000,
                median: 1200000,
                std: 600000
            },
            actionFrequency: {},
            navigationPatterns: [],
            typingSpeed: 40,
            deviceConsistency: 0.5,
            locationConsistency: 0.5,
            browserFeatureUsage: {},
            riskScore: 0,
            riskFactors: [],
            lastUpdated: new Date(),
            mlFeatures: {},
            mlPredictions: []
        };
    }
    cleanupExpiredSessions() {
        const now = Date.now();
        const expiredSessions = [];
        for (const [sessionId, session] of this.activeSessions.entries()) {
            const lastActivity = session.activities.length > 0
                ? session.activities[session.activities.length - 1].timestamp.getTime()
                : session.startTime.getTime();
            if (now - lastActivity > this.config.sessionTimeout) {
                expiredSessions.push(sessionId);
            }
        }
        for (const sessionId of expiredSessions) {
            this.endSession(sessionId);
        }
    }
    async handleAnomalies(session, anomalies) {
        for (const anomaly of anomalies) {
            if (anomaly.severity === 'critical' || anomaly.severity === 'high') {
                // Create security alert
                const alert = {
                    id: crypto.randomUUID(),
                    userId: session.userId,
                    sessionId: session.sessionId,
                    alertType: anomaly.type,
                    severity: anomaly.severity,
                    title: this.getAnomalyTitle(anomaly.type),
                    description: anomaly.description,
                    evidence: anomaly.evidence,
                    confidence: 0.8,
                    status: 'open',
                    createdAt: new Date()
                };
                await this.saveAlert(alert);
            }
        }
    }
    getAnomalyTitle(type) {
        const titles = {
            'unusual_login_time': 'Unusual Login Time Detected',
            'suspicious_activity_speed': 'Suspicious Activity Speed',
            'location_anomaly': 'Unusual Location Access',
            'device_anomaly': 'Unknown Device Access',
            'navigation_anomaly': 'Unusual Navigation Pattern'
        };
        return titles[type] || 'Behavioral Anomaly Detected';
    }
    async saveAlert(alert) {
        try {
            await this.supabase
                .from('security_incidents')
                .insert({
                id: alert.id,
                user_id: alert.userId,
                incident_type: alert.alertType,
                severity: alert.severity,
                title: alert.title,
                description: alert.description,
                evidence: alert.evidence,
                status: alert.status,
                created_at: alert.createdAt.toISOString()
            });
        }
        catch (error) {
            console.error('❌ Failed to save behavior alert:', error);
        }
    }
    // Placeholder implementations for anomaly detection methods
    async checkTimeBasedAnomalies(activity, profile) {
        return [];
    }
    async checkLocationAnomalies(activity, profile) {
        return [];
    }
    async checkDeviceAnomalies(activity, profile) {
        return [];
    }
    async checkActivitySpeedAnomalies(activity, profile) {
        return [];
    }
    async checkNavigationAnomalies(activity, profile) {
        return [];
    }
    // Additional helper methods would be implemented here...
    calculateHourDeviation(currentHour, typicalHours) {
        if (typicalHours.length === 0)
            return 0;
        const nearest = typicalHours.reduce((closest, hour) => {
            const diff = Math.abs(hour - currentHour);
            const closestDiff = Math.abs(closest - currentHour);
            return diff < closestDiff ? hour : closest;
        });
        return Math.abs(currentHour - nearest);
    }
    calculateTimeBetweenActions(activities) {
        if (activities.length < 2)
            return 0;
        const times = activities.map(a => a.timestamp.getTime());
        const differences = times.slice(1).map((time, i) => time - times[i]);
        return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    }
    getExpectedTimeBetweenActions(action, profile) {
        // Return expected time based on action type and user profile
        const baseTime = 2000; // 2 seconds default
        const actionMultipliers = {
            'page_view': 0.5,
            'form_submit': 2.0,
            'transaction': 5.0
        };
        return baseTime * (actionMultipliers[action] || 1.0);
    }
    identifySuspiciousPatterns(session) {
        const patterns = [];
        // Check for rapid-fire actions
        const rapidActions = session.activities.filter((activity, index) => {
            if (index === 0)
                return false;
            const timeDiff = activity.timestamp.getTime() - session.activities[index - 1].timestamp.getTime();
            return timeDiff < 100; // Less than 100ms between actions
        });
        if (rapidActions.length > 3) {
            patterns.push('rapid_fire_actions');
        }
        return patterns;
    }
    classifySessionBehavior(session) {
        const anomalyCount = session.anomalies.length;
        const activityCount = session.activities.length;
        const duration = session.endTime.getTime() - session.startTime.getTime();
        if (anomalyCount === 0 && activityCount > 0)
            return 'normal';
        if (anomalyCount > 0 && anomalyCount / activityCount < 0.1)
            return 'slightly_suspicious';
        if (anomalyCount / activityCount >= 0.1)
            return 'highly_suspicious';
        if (activityCount === 0 && duration < 60000)
            return 'bot_like';
        return 'unknown';
    }
    // Additional calculation methods would be implemented here...
    async getUserSessions(userId, timeframe) {
        // Implementation would fetch session data from database
        return [];
    }
    async generateBehaviorProfile(userId, sessions) {
        // Implementation would analyze sessions to build comprehensive profile
        return this.getDefaultBehaviorProfile(userId);
    }
    extractBehaviorInsights(profile, sessions) {
        return [];
    }
    generateSecurityRecommendations(profile, insights) {
        return [];
    }
    assessUserRisk(profile, sessions) {
        return { riskLevel: 'low', score: 0 };
    }
    async saveSessionData(session, analysis) {
        // Implementation would save session data to database
    }
    async updateBehaviorProfile(session) {
        // Implementation would update user behavior profile
    }
    calculateAverageSessionDuration(sessions) {
        return 1800000; // 30 minutes default
    }
    calculateEntropyOfActiveHours(hours) {
        return 0.5; // Placeholder
    }
    calculateAverageProcessingTime(sessions) {
        return 1000; // 1 second default
    }
    calculateAnomalyFrequency(sessions) {
        return 0.1; // 10% default
    }
    calculateFailedActionRatio(sessions) {
        return 0.05; // 5% default
    }
    calculateTypingSpeedConsistency(sessions) {
        return 0.8; // 80% consistency
    }
    calculateNavigationUniqueness(patterns) {
        return 0.7; // 70% uniqueness
    }
    calculateTimeBetweenActionsVariance(sessions) {
        return 500; // 500ms variance
    }
}
// Export singleton instance and utility functions
export const behaviorAnalyzer = BehaviorAnalyzer.getInstance();
export const startBehaviorTracking = (userId, sessionId, metadata) => {
    return behaviorAnalyzer.startSession(userId, sessionId, metadata);
};
export const trackUserActivity = (sessionId, activity) => {
    return behaviorAnalyzer.trackActivity(sessionId, activity);
};
export const endBehaviorTracking = (sessionId) => {
    return behaviorAnalyzer.endSession(sessionId);
};
export const detectBehaviorAnomalies = (userId, activity) => {
    return behaviorAnalyzer.detectAnomalies(userId, activity);
};
export const analyzeBehaviorPatterns = (userId, timeframe) => {
    return behaviorAnalyzer.analyzeBehaviorPatterns(userId, timeframe);
};
// Constants
export const BEHAVIOR_PROFILE_TYPES = {
    NORMAL: 'normal',
    POWER_USER: 'power_user',
    SUSPICIOUS: 'suspicious',
    BOT: 'bot'
};
export const ANOMALY_TYPES = {
    UNUSUAL_LOGIN_TIME: 'unusual_login_time',
    SUSPICIOUS_ACTIVITY_SPEED: 'suspicious_activity_speed',
    LOCATION_ANOMALY: 'location_anomaly',
    DEVICE_ANOMALY: 'device_anomaly',
    NAVIGATION_ANOMALY: 'navigation_anomaly'
};
