# HyperIndex Documentation

> Complete documentation for HyperIndex project development and maintenance.

**Last Updated**: 2025-11-12
**Status**: Post-Demo Migration Complete, Active Development

---

## 🎯 Current Project Status

**Active Development Folder**: `/Users/kimhyeon/Desktop/PROJECTS/Cryptoindex-V0`
**Archive**: `/Users/kimhyeon/Desktop/PROJECTS/YCOMDEMO` (reference only)

**Recent Changes**:
- ✅ YC Demo improvements integrated
- ✅ Route naming standardized (`/trade`, `/vote`)
- ✅ Latest components updated (Header, Footer, layout)
- ✅ Ready for continued development

---

## 📁 Folder Structure

```
/docs
  /handover          # Development session records
    HANDOVER.md               # Latest sessions (current work)
    HANDOVER_ARCHIVE.md       # Historical sessions
    POST_DEMO_HANDOVER.md     # Demo migration details

  /planning          # Design & planning documents
    /2025OCT04/              # October Week 4 planning
    /2025NOV01/              # November Week 1 (YC Demo)

  /backend           # Backend integration docs
    BACKEND_INTEGRATION_CHECKLIST.md
    BACKEND_DATA_REQUIREMENTS.md

  README.md          # This file
```

---

## 📋 Key Documents

### Handover Documents (Start Here)

**HANDOVER.md** - Current work status
- Latest development sessions
- Current progress and blockers
- Next steps and priorities
- Updated after every significant task

**POST_DEMO_HANDOVER.md** - Demo migration details
- What changed during demo work
- Migration process and decisions
- Route naming standards
- Testing checklist

**HANDOVER_ARCHIVE.md** - Historical sessions
- Past work from Nov 2 and earlier
- Reference for understanding project evolution

### Planning Documents

**2025NOV01/** - YC Demo Development
- Task plans grouped by phases
- Work logs with detailed implementation notes
- Checklists and issue tracking
- Reference: YCOMDEMO archive folder for full details

**2025OCT04/** - October planning
- Fee structure implementation
- Currency system refactoring
- Security considerations

### Backend Integration

**BACKEND_INTEGRATION_CHECKLIST.md**
- API endpoints status
- Integration progress tracking
- Update after each backend integration

**BACKEND_DATA_REQUIREMENTS.md**
- Required data structures
- API response formats
- Data flow specifications

---

## 🚀 Quick Start

### For New Claude Sessions

1. **Read HANDOVER.md** - Understand current status
2. **Check Planning Docs** - Review relevant task plans
3. **Start Development** - Follow established patterns

### For Continuing Work

1. **Update HANDOVER.md** - After completing tasks
2. **Create Work Logs** - For significant features
3. **Document Decisions** - Technical choices and rationale

---

## 🎨 Route Standards

**Official Routes** (as of Nov 12, 2025):
- `/trade` ✅ (NOT `/trading`)
- `/vote` ✅ (NOT `/governance`)
- `/launch` ✅
- `/discover` ✅
- `/leaderboard` ✅
- `/portfolio` ✅
- `/referrals` ✅
- `/settings` ✅
- `/notifications` ✅

**Rationale**: Shorter, cleaner URLs. Demo naming became the standard.

---

## 📊 Project Statistics

**Components**: 274 files (post-demo)
**Pages**: 11 active routes
**Last Major Update**: Nov 11, 2025 (demo work)
**Migration Date**: Nov 12, 2025

**Key Additions** (from demo work):
- `components/layout/HeaderNav.tsx` (NEW)
- `components/layout/PriceAlertsPopover.tsx` (NEW)
- `lib/constants/colors.ts` (NEW)
- `lib/data/launched-indexes.ts` (NEW)
- `lib/mock/market-data.ts` (NEW)
- `hooks/use-launch-form.ts` (NEW)

---

## 🔄 Documentation Update Rules

### When Starting Work
1. Read `HANDOVER.md` for current status
2. Check relevant planning docs in `/planning/YYYYMMMWW/`
3. Review related work logs if available

### When Completing Work
1. Update `HANDOVER.md` with new session
2. Archive old sessions to `HANDOVER_ARCHIVE.md` (keep 2-3 latest)
3. Update backend docs if API integration involved
4. Create work log for significant features

### Planning Document Format
- Folder naming: `YYYYMMMWW` (e.g., 2025NOV02 = November Week 2)
- Month codes: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC
- Week: 01-05 (week number within month)

### Writing Guidelines
- Use concise bullet points
- Preserve all technical information
- Avoid emojis in code documentation
- Include file paths and line counts
- Document technical decisions and rationale

---

## 🧪 Testing Checklist

### Page Routing Tests
- [ ] Landing page (`/`)
- [ ] Trading page (`/trade`)
- [ ] Launch page (`/launch`)
- [ ] Governance (`/vote`, `/vote/[id]`)
- [ ] Discover page (`/discover`)
- [ ] Leaderboard (`/leaderboard`)
- [ ] Portfolio (`/portfolio`)
- [ ] Referrals (`/referrals`)
- [ ] Settings (`/settings`)
- [ ] Notifications (`/notifications`)

### Component Tests
- [ ] Header & navigation
- [ ] Footer
- [ ] Wallet connection (Privy)
- [ ] Trading panel
- [ ] Launch wizard
- [ ] Governance voting

### Integration Tests
- [ ] Mock data displays correctly
- [ ] Responsive layout works
- [ ] Calculations accurate (fees, PnL, liquidation)

---

## 📌 Important Notes

### Development Rules
1. **Dev Server**: User runs `pnpm run dev` themselves
2. **Package Manager**: Always use `pnpm`, never `npm`
3. **Route Names**: Use official standards (`/trade`, `/vote`)
4. **Git**: Full history available, no need for backup folders
5. **Documentation**: Update handover docs after every task

### Backend Integration
- Update checklist: `backend/BACKEND_INTEGRATION_CHECKLIST.md`
- Update requirements: `backend/BACKEND_DATA_REQUIREMENTS.md`
- Document all API changes

### For Future Reference
- **Demo Archive**: `/Users/kimhyeon/Desktop/PROJECTS/YCOMDEMO`
- **Planning Archive**: Contains all YC Demo work logs and task plans
- **Git History**: Complete version control, use for rollback if needed

---

## 🔗 Quick Links

**Current Work**:
- [Latest Session](./handover/HANDOVER.md)
- [Demo Migration Details](./handover/POST_DEMO_HANDOVER.md)
- [Project Environment Info](/CLAUDE.md)

**Backend**:
- [Integration Checklist](./backend/BACKEND_INTEGRATION_CHECKLIST.md)
- [Data Requirements](./backend/BACKEND_DATA_REQUIREMENTS.md)

**Planning**:
- [November 2025 Planning](./planning/2025NOV01/)
- [October 2025 Planning](./planning/2025OCT04/)

**Archive**:
- [Historical Sessions](./handover/HANDOVER_ARCHIVE.md)
- [YCOMDEMO Folder](../../YCOMDEMO/)

---

## 🎯 Next Steps

### Immediate Priorities
1. Test all routes post-migration
2. Verify responsive layout
3. Check wallet connection flow
4. Validate trading calculations

### Development Resumption
- Continue backend integration
- Implement new features
- Address known issues
- Performance optimization

### Documentation Maintenance
- Keep HANDOVER.md current
- Archive old sessions regularly
- Update backend docs as needed
- Maintain planning docs structure

---

*This documentation reflects the state of the project after YC Demo migration on Nov 12, 2025.*
