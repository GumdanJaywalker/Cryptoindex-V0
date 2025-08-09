# Documentation

This folder contains project documentation organized by relevance and date.

## Current Documentation

### System Architecture
- **HybridTradingSystem_Architecture_0801.md** - Core hybrid trading system design
- **OrderbookArchitecture_Design_0801.md** - Redis-based orderbook architecture
- **ARCHITECTURE_FLOW_EXAMPLE.md** - System flow examples and patterns

### Development Reports
- **0801_Worked_Report.md** - Development progress report (Aug 1, 2025)
- **SESSION_RECOVERY_0801.md** - Session recovery mechanisms

## Archive

The `/archive/` folder contains legacy and outdated documentation that may still be useful for reference but should not be used for current development:

### Legacy Architecture Documents
- Various Korean-language planning documents
- Outdated trading system designs
- Old project status reports
- Security analysis reports
- Implementation comparison documents

## Project Documentation Guidelines

### For Developers
- **Primary Reference**: Always use `/CLAUDE.md` in the root directory
- **Current Architecture**: Refer to the 0801 architecture documents
- **API Documentation**: Check inline comments and test pages

### For New Features
1. Update `/CLAUDE.md` with new functionality
2. Add architecture changes to appropriate docs
3. Include examples in test pages
4. Document breaking changes

### Document Lifecycle
1. **Active**: Documents used for current development
2. **Archive**: Outdated but potentially useful for reference
3. **Cleanup**: Remove completely obsolete documents periodically

## Quick Reference

- **Main Documentation**: `/CLAUDE.md`
- **Trading System**: `HybridTradingSystem_Architecture_0801.md`
- **Database Schema**: See `/supabase/migrations/`
- **API Endpoints**: Test via `/test-*` pages
- **Performance Testing**: `/trading-simulator`

For the most up-to-date information, always refer to the main CLAUDE.md file and the actual implementation.