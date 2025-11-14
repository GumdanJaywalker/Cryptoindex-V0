# UI Component Library Catalog

**Document**: Complete Component Inventory and Usage Guide
**Created**: 2025-11-05
**Status**: Reference catalog (no user input required)

---

## Table of Contents

1. [Component Inventory](#1-component-inventory)
2. [shadcn/ui Base Components](#2-shadcnui-base-components)
3. [MagicUI Effects](#3-magicui-effects)
4. [Aceternity UI Animations](#4-aceternity-ui-animations)
5. [Custom YCOMDEMO Components](#5-custom-ycomdemo-components)
6. [Component Usage Guidelines](#6-component-usage-guidelines)
7. [Integration Patterns](#7-integration-patterns)

---

## 1. Component Inventory

### 1.1 Total Component Count

**By Category**:
```
shadcn/ui Base:          52 components
Aceternity UI:           84 components
MagicUI:                 14 components
Custom Trading:          27 components
Custom Portfolio:        13 components
Custom Governance:        7 components
Custom Wallet:           15 components
Custom Launch:            7 components
Custom Settings:          7 components
Custom Notifications:     5 components
Custom Modals:            5 components
Custom Sidebar:           2 components
Custom Mobile:            3 components
Custom Layout:            2 components
Other Custom:            10 components
---
TOTAL:                  253 components
```

**Organization**:
```
/components
  /ui                 # shadcn + Aceternity (136 files)
  /magicui            # MagicUI effects (14 files)
  /trading            # Trading-specific (27 files)
  /portfolio          # Portfolio-specific (13 files)
  /wallet             # Wallet integration (15 files)
  /governance         # Governance (7 files)
  /launch             # Index creation (7 files)
  /settings           # Settings (7 files)
  /notifications      # Notifications (5 files)
  /dialogs            # Dialogs/modals (5 files)
  /mobile             # Mobile optimization (3 files)
  /sidebar            # Unified sidebar (2 files)
  /layout             # Header/Footer (2 files)
  /modals             # Additional modals (1 file)
  /discover           # Discover page (1 file)
  /pwa                # PWA install (1 file)
  /auth               # Authentication (1 file)
  /demo               # Demo showcase (1 file)
  /providers          # Context providers (2 files)
  theme-provider.tsx  # Theme provider
```

---

## 2. shadcn/ui Base Components

### 2.1 Form & Input Components (14)

**Text Inputs**:
- `input.tsx` - Text input field with variants
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form label with accessibility
- `form.tsx` - React Hook Form integration

**Selection Inputs**:
- `select.tsx` - Dropdown select (Radix UI)
- `combobox.tsx` - Searchable select (cmdk)
- `command.tsx` - Command palette (cmdk)
- `checkbox.tsx` - Checkbox with indeterminate state
- `radio-group.tsx` - Radio button group
- `switch.tsx` - Toggle switch

**Date & Time**:
- `calendar.tsx` - Date picker calendar (react-day-picker)
- `date-picker.tsx` - Date input with calendar popup

**File Input**:
- `file-upload.tsx` - Aceternity file upload with drag-drop

**OTP Input**:
- `input-otp.tsx` - One-time password input

---

### 2.2 Navigation Components (9)

**Menus**:
- `dropdown-menu.tsx` - Dropdown menu (Radix UI)
- `context-menu.tsx` - Right-click context menu
- `menubar.tsx` - Horizontal menu bar
- `navigation-menu.tsx` - Complex navigation menu
- `navbar-menu.tsx` - Aceternity navbar with submenus

**Navigation Elements**:
- `breadcrumb.tsx` - Breadcrumb trail
- `pagination.tsx` - Page pagination
- `tabs.tsx` - Tab navigation (Radix UI)
- `sidebar.tsx` - Collapsible sidebar (shadcn sidebar)

---

### 2.3 Overlay Components (8)

**Dialogs & Modals**:
- `dialog.tsx` - Modal dialog (Radix UI)
- `alert-dialog.tsx` - Confirmation dialog
- `animated-modal.tsx` - Aceternity modal with animations
- `drawer.tsx` - Bottom/side drawer (Vaul)
- `sheet.tsx` - Slide-in sheet (Radix UI)

**Tooltips & Popovers**:
- `tooltip.tsx` - Tooltip (Radix UI)
- `animated-tooltip.tsx` - Aceternity animated tooltip
- `popover.tsx` - Popover menu (Radix UI)
- `hover-card.tsx` - Hover card with delay (Radix UI)

---

### 2.4 Feedback Components (7)

**Alerts & Toasts**:
- `alert.tsx` - Alert banner
- `toast.tsx` - Toast notification (Radix UI)
- `sonner.tsx` - Sonner toast library integration

**Loading & Progress**:
- `skeleton.tsx` - Loading skeleton placeholder
- `progress.tsx` - Progress bar (Radix UI)
- `multi-step-loader.tsx` - Aceternity step-by-step loader
- `spinner.tsx` - (Not a file, use Lucide `<Loader2 className="animate-spin" />`)

---

### 2.5 Data Display Components (8)

**Cards**:
- `card.tsx` - Basic card component
- `bento-grid.tsx` - Aceternity bento grid layout
- `focus-cards.tsx` - Aceternity focus blur cards
- `card-hover-effect.tsx` - Aceternity 3D hover cards

**Tables & Lists**:
- `table.tsx` - HTML table with styling
- `data-table.tsx` - (Not a dedicated file, use TanStack Table)
- `scroll-area.tsx` - Custom scrollbar (Radix UI)

**Charts**:
- `chart.tsx` - Recharts integration (shadcn charts)

---

### 2.6 Layout Components (6)

**Containers**:
- `separator.tsx` - Horizontal/vertical divider
- `aspect-ratio.tsx` - Aspect ratio container (Radix UI)
- `resizable.tsx` - Resizable panels (react-resizable-panels)

**Accordion & Collapsible**:
- `accordion.tsx` - Accordion (Radix UI)
- `collapsible.tsx` - Collapsible section (Radix UI)

**Carousel**:
- `carousel.tsx` - Carousel/slider (Embla)

---

### 2.7 Utility Components (5)

**Avatar & Badge**:
- `avatar.tsx` - User avatar with fallback (Radix UI)
- `badge.tsx` - Status badge

**Slider**:
- `slider.tsx` - Range slider (Radix UI)

**Code**:
- `code-block.tsx` - Syntax-highlighted code block

**Optimized Image**:
- `optimized-image.tsx` - Next.js Image wrapper

---

## 3. MagicUI Effects

### 3.1 MagicUI Catalog (14 Components)

**Location**: `/components/magicui/`

**Button Effects**:
1. `pulsating-button.tsx` - Pulsing animation button
2. `shimmer-button.tsx` - Shimmer sweep effect (used for CTAs)

**Card Effects**:
3. `magic-card.tsx` - Gradient spotlight follows cursor
4. `border-beam.tsx` - Animated border glow

**Background Effects**:
5. `ripple.tsx` - Click ripple effect
6. `particles.tsx` - Particle background
7. `meteors.tsx` - Falling meteors animation

**Text Effects**:
8. `animated-gradient-text.tsx` - Gradient text animation
9. `number-ticker.tsx` - Counting number animation

**Animation Effects**:
10. `blur-in.tsx` - Blur fade-in entrance
11. `slide-in.tsx` - Slide-in from direction
12. `animated-beam.tsx` - Connecting line animation
13. `orbiting-circles.tsx` - Circular orbit animation

**3D Elements**:
14. `globe.tsx` - 3D rotating globe

---

### 3.2 MagicUI Usage Examples

**Shimmer Button** (Primary CTAs):
```tsx
import { ShimmerButton } from '@/components/magicui/shimmer-button';

<ShimmerButton>
  Launch Index
</ShimmerButton>
```

**Magic Card** (Interactive cards):
```tsx
import { MagicCard } from '@/components/magicui/magic-card';

<MagicCard className="cursor-pointer">
  <h3>Index Name</h3>
  <p>Description</p>
</MagicCard>
```

**Number Ticker** (Animated stats):
```tsx
import { NumberTicker } from '@/components/magicui/number-ticker';

<NumberTicker value={1234567.89} />
```

**Border Beam** (Highlighted cards):
```tsx
import { BorderBeam } from '@/components/magicui/border-beam';

<div className="relative">
  <BorderBeam />
  <div className="p-6">Content</div>
</div>
```

---

## 4. Aceternity UI Animations

### 4.1 Background Effects (12)

**Location**: `/components/ui/`

1. `aurora-background.tsx` - Aurora borealis light effect
2. `background-beams.tsx` - Light beam rays
3. `background-beams-with-collision.tsx` - Beams with collision detection
4. `background-gradient.tsx` - Animated gradient background
5. `wavy-background.tsx` - Wave animation
6. `grid-pattern.tsx` - (Not listed, may be in globals.css)
7. `shooting-stars.tsx` - Shooting stars animation
8. `glowing-stars.tsx` - Star glow particles
9. `sparkles.tsx` - Sparkle particles
10. `meteors.tsx` - Duplicate of MagicUI version
11. `spotlight.tsx` - Spotlight effect
12. `spotlight-new.tsx` - Updated spotlight

---

### 4.2 Card Effects (15)

1. `3d-card.tsx` - Tilt-on-hover 3D card
2. `card-hover-effect.tsx` - 3D hover transform
3. `direction-aware-hover.tsx` - Hover direction detection
4. `evervault-card.tsx` - Card pattern encryption effect
5. `focus-cards.tsx` - Focus blur effect
6. `glare-card.tsx` - Glare reflection
7. `hover-border-gradient.tsx` - Animated gradient border
8. `moving-border.tsx` - Border animation
9. `bento-grid.tsx` - Grid layout with hover
10. `layout-grid.tsx` - Expandable grid layout
11. `draggable-card.tsx` - Drag-to-reorder cards
12. `infinite-moving-cards.tsx` - Infinite scrolling carousel
13. `apple-cards-carousel.tsx` - Apple-style carousel
14. `animated-testimonials.tsx` - Testimonial slider
15. `compare.tsx` - Before/after slider

---

### 4.3 Text Effects (12)

1. `text-generate-effect.tsx` - Text generation animation
2. `text-hover-effect.tsx` - Text hover animations
3. `animated-gradient-text.tsx` - Gradient text (duplicate of MagicUI)
4. `colourful-text.tsx` - Rainbow text effect
5. `flip-words.tsx` - Word flip animation
6. `container-text-flip.tsx` - Text flip on scroll
7. `hero-highlight.tsx` - Text highlight animation
8. `cover.tsx` - Text reveal cover effect
9. `type-writer-effect.tsx` - (Not listed, may exist)
10. `placeholder-and-vanish-input.tsx` - Input placeholder animation
11. `currency-number-ticker.tsx` - Custom number ticker for currency
12. `moving-text.tsx` - (May exist, check /ui)

---

### 4.4 3D & Parallax Effects (8)

1. `3d-card.tsx` - (Already listed in cards)
2. `3d-effects.tsx` - Generic 3D transforms
3. `3d-marquee.tsx` - 3D rotating marquee
4. `3d-pin.tsx` - 3D pin/tag effect
5. `parallax-scroll.tsx` - Multi-layer parallax
6. `container-scroll-animation.tsx` - Parallax scroll container
7. `hero-parallax.tsx` - Hero section parallax
8. `macbook-scroll.tsx` - MacBook frame with scroll

---

### 4.5 Navigation & Menu (6)

1. `floating-navbar.tsx` - Floating navigation bar
2. `navbar-menu.tsx` - Menu with submenus
3. `floating-dock.tsx` - macOS-style dock
4. `resizable-navbar.tsx` - Resizable navigation

**Already in shadcn**:
5. `navigation-menu.tsx` - Complex nav (shadcn)
6. `menubar.tsx` - Horizontal menu (shadcn)

---

### 4.6 Interactive Effects (10)

1. `following-pointer.tsx` - Cursor follower
2. `pointer-highlight.tsx` - Pointer highlight effect
3. `lens.tsx` - Magnifying lens effect
4. `images-slider.tsx` - Image slider with effects
5. `google-gemini-effect.tsx` - Gemini-style animation
6. `lamp.tsx` - Lamp light effect
7. `link-preview.tsx` - Hover link preview
8. `stateful-button.tsx` - Button with state animations
9. `sound-settings.tsx` - Sound toggle with animation
10. `glowing-effect.tsx` - Generic glow effect

---

### 4.7 Scroll Animations (4)

1. `tracing-beam.tsx` - Vertical scroll progress beam
2. `sticky-scroll-reveal.tsx` - Content reveal on scroll
3. `container-scroll-animation.tsx` - (Already listed)
4. `parallax-scroll.tsx` - (Already listed)

---

### 4.8 Other Aceternity Components (17)

**Modal & Overlay**:
- `animated-modal.tsx`
- `animated-tooltip.tsx`

**Loading**:
- `multi-step-loader.tsx`

**Text Input**:
- `placeholders-and-vanish-input.tsx`

**File**:
- `file-upload.tsx`

**Globe**:
- `globe.tsx` - Duplicate of MagicUI version

**Misc**:
- `animated-background.tsx`
- `optimized-image.tsx`
- `code-block.tsx`
- `calendar.tsx`
- `chart.tsx`
- `currency-number-ticker.tsx`
- And more (see full /ui folder)

---

## 5. Custom YCOMDEMO Components

### 5.1 Trading Components (27 Files)

**Location**: `/components/trading/`

**Core Trading**:
1. `TradingLayout.tsx` - Main trading page layout
2. `TradingPanel.tsx` - Legacy trading panel
3. `TradingPanelSimple.tsx` - Simplified trading panel (current)
4. `trade-panel.tsx` - Alternative trade panel
5. `quick-trade-button.tsx` - Quick trade action button

**Market Data**:
6. `OrderBook.tsx` - Orderbook display
7. `OrderBookTrades.tsx` - Combined orderbook + trades
8. `RecentTrades.tsx` - Recent trades list
9. `trending-indexes.tsx` - Trending indexes sidebar

**Chart & Visualization**:
10. `ChartArea.tsx` - TradingView chart wrapper (current)
11. `ChartAreaOld.tsx` - Legacy chart implementation
12. `BuySellAnalysis.tsx` - Buy/sell pressure analysis

**Index & Asset Display**:
13. `IndexInfoBar.tsx` - Index info header bar
14. `IndexInfoModal.tsx` - Index details modal
15. `index-row.tsx` - Index table row with sparkline
16. `index-card.tsx` - Index card with hover glow

**Trader Information**:
17. `top-traders.tsx` - Top traders leaderboard
18. `trader-card.tsx` - Trader profile card
19. `trader-details-modal.tsx` - Trader profile modal
20. `WhaleAlert.tsx` - Whale transaction alerts

**Account & Portfolio**:
21. `AccountPanel.tsx` - Account info panel
22. `PresetPanel.tsx` - Preset trade amounts

**Other**:
23. `CommunityFeed.tsx` - Community activity feed
24. `GraduationProgress.tsx` - Index graduation progress
25. `LiquidityModal.tsx` - Liquidity details modal
26. `TradingBottomTabs.tsx` - Mobile bottom tabs
27. `confirm-modal.tsx` - Trade confirmation modal

---

### 5.2 Portfolio Components (13 Files)

**Location**: `/components/portfolio/`

**Main Views**:
1. `PortfolioOverview.tsx` - Portfolio summary dashboard
2. `PortfolioPositions.tsx` - Open positions table
3. `PortfolioHistory.tsx` - Trade history table

**Index Details** (`/portfolio/index-details/`):
4. `IndexDetailsLayout.tsx` - Index detail page layout
5. `IndexHeader.tsx` - Index header with stats
6. `PerformanceChart.tsx` - Performance chart
7. `CompositionBreakdown.tsx` - Asset composition pie chart
8. `HistoricalData.tsx` - Historical price data table

**Trading**:
9. `TradingInterface.tsx` - Embedded trading interface

**Other**:
10. `PositionCard.tsx` - Position summary card
11. `ClosePositionModal.tsx` - Close position confirmation
12. `TransactionHistory.tsx` - Transaction list
13. `PnLSummary.tsx` - PnL summary stats

---

### 5.3 Governance Components (7 Files)

**Location**: `/components/governance/`

1. `GovernanceLayout.tsx` - Governance page layout (Votes Hub)
2. `GovernanceDashboard.tsx` - Stats dashboard
3. `ProposalsSection.tsx` - Governance proposals list (removed in Phase 4)
4. `RebalancingVotesSection.tsx` - Rebalancing votes section
5. `RebalancingVoteCard.tsx` - Individual rebalancing vote card
6. `MyActiveVotes.tsx` - Active votes summary (Phase 4)
7. `VsBattleVoteModal.tsx` - VS Battle voting modal (Phase 4)

---

### 5.4 Wallet Components (15 Files)

**Location**: `/components/wallet/`

**Main Components**:
1. `ConnectButton.tsx` - Wallet connect button
2. `WalletButton.tsx` - Alternative wallet button
3. `WalletSelector.tsx` - Wallet selection modal
4. `WalletInfo.tsx` - Connected wallet info display
5. `WalletModal.tsx` - Wallet modal dialog

**Network**:
6. `NetworkSelector.tsx` - Network switcher
7. `NetworkSwitcher.tsx` - Alternative network switcher
8. `NetworkDisplay.tsx` - Network badge display

**Other**:
9. `BalanceDisplay.tsx` - Token balance display
10. `DisconnectButton.tsx` - Disconnect wallet button
11. `WalletAddress.tsx` - Address display with copy
12. `TransactionStatus.tsx` - Transaction status indicator
13. `GasEstimator.tsx` - Gas fee estimator

**Duplicates** (legacy):
14. `connect-wallet.tsx` - Legacy connect button
15. `wallet-dropdown.tsx` - Legacy wallet dropdown

---

### 5.5 Launch Components (7 Files)

**Location**: `/components/launch/`

**Wizard Steps**:
1. `BasicInfoStep.tsx` - Step 1: Name, symbol, description
2. `ComponentsStep.tsx` - Step 2: Asset selection
3. `ReviewStep.tsx` - Step 3: Preview and launch

**Asset Selection**:
4. `AssetSelectionPanel.tsx` - Asset search and selection
5. `SelectedAssetsList.tsx` - Selected assets with weights

**Preview**:
6. `PreviewChart.tsx` - Index preview chart

**Other**:
7. `CostSummary.tsx` - Launch cost breakdown

---

### 5.6 Settings Components (7 Files)

**Location**: `/components/settings/`

1. `AccountSettings.tsx` - Account information settings
2. `PreferencesSettings.tsx` - User preferences (theme, language)
3. `NotificationSettings.tsx` - Notification preferences
4. `SecuritySettings.tsx` - Security and 2FA
5. `DisplaySettings.tsx` - Display options (density, currency)
6. `ApiKeysSettings.tsx` - API key management
7. `SettingsLayout.tsx` - Settings page layout

---

### 5.7 Other Custom Components

**Notifications** (`/components/notifications/`):
- `NotificationBell.tsx` - Notification bell icon with count
- `NotificationList.tsx` - Notification dropdown list
- `NotificationItem.tsx` - Individual notification
- `NotificationPreferences.tsx` - Notification settings
- `PriceAlertForm.tsx` - Create price alert form

**Dialogs** (`/components/dialogs/`):
- `ConfirmDialog.tsx` - Generic confirmation dialog
- `WalletConnectDialog.tsx` - Wallet connection dialog
- `NetworkSwitchDialog.tsx` - Network switch dialog
- `TradeConfirmDialog.tsx` - Trade confirmation dialog
- `ErrorDialog.tsx` - Error display dialog

**Mobile** (`/components/mobile/`):
- `MobileNav.tsx` - Mobile navigation menu
- `MobileBottomBar.tsx` - Bottom navigation bar
- `MobileSidebar.tsx` - Mobile sidebar drawer

**Sidebar** (`/components/sidebar/`):
- `AppSidebar.tsx` - Main app sidebar (unified)
- `SidebarNav.tsx` - Sidebar navigation items

**Layout** (`/components/layout/`):
- `Header.tsx` - App header with nav
- `Footer.tsx` - App footer

**Modals** (`/components/modals/`):
- `AllIndicesModal.tsx` - View all indices modal

**Discover** (`/components/discover/`):
- `layer-tabs.tsx` - Layer filter tabs (L1/L2/L3)

**VS Battle** (`/components/discover/`):
- `vs-battle-section.tsx` - VS Battle section
- `battle-card.tsx` - Individual battle card

**PWA** (`/components/pwa/`):
- `PWAInstallPrompt.tsx` - PWA install prompt

**Auth** (`/components/auth/`):
- `PrivyProvider.tsx` - Privy authentication provider

**Demo** (`/components/demo/`):
- `CardsDemo.tsx` - Component demo showcase

**Providers** (`/components/providers/`):
- `ToastProvider.tsx` - Toast notification provider
- `QueryProvider.tsx` - React Query provider

---

## 6. Component Usage Guidelines

### 6.1 When to Use shadcn/ui vs Aceternity

**shadcn/ui** (Functional, minimal):
- Forms and inputs (input, select, checkbox, radio)
- Navigation (tabs, dropdown, breadcrumb)
- Overlays (dialog, popover, tooltip)
- Data display (table, card, badge, avatar)
- Feedback (alert, toast, progress, skeleton)

**Aceternity UI** (Decorative, animated):
- Hero sections (hero-parallax, spotlight)
- Landing pages (aurora-background, wavy-background)
- Marketing content (animated-testimonials, infinite-moving-cards)
- Showcase sections (bento-grid, focus-cards)
- Text effects (text-generate-effect, flip-words)

**Rule**: Prefer shadcn/ui for core app functionality. Use Aceternity for marketing pages and decorative elements only.

---

### 6.2 When to Use MagicUI

**Primary Use Cases**:
- **Shimmer Button**: Primary CTAs only (Launch Index, Connect Wallet)
- **Magic Card**: Interactive index cards, feature cards
- **Border Beam**: Highlight important cards (featured indexes)
- **Number Ticker**: Animated stats counters (portfolio value, 24h volume)
- **Blur In / Slide In**: Page entrance animations

**Avoid**:
- Pulsating Button (too much visual noise)
- Meteors / Particles (performance concerns)
- Orbiting Circles (decorative, not functional)

---

### 6.3 Component Selection Decision Tree

```
Need a component?
├─ Form input?
│  └─ Use shadcn/ui (input, select, checkbox, etc.)
├─ Navigation?
│  └─ Use shadcn/ui (tabs, dropdown, navigation-menu)
├─ Modal/Dialog?
│  └─ Use shadcn/ui (dialog, alert-dialog, sheet)
├─ Card with hover effect?
│  ├─ Functional card → Use shadcn card + custom hover
│  └─ Decorative card → Use MagicUI magic-card or Aceternity 3d-card
├─ Button?
│  ├─ Primary CTA → Use MagicUI shimmer-button
│  ├─ Standard button → Use shadcn button
│  └─ Icon button → Use shadcn button variant="ghost"
├─ Background effect?
│  └─ Use Aceternity background components (aurora, beams, etc.)
├─ Text animation?
│  └─ Use Aceternity text effects (text-generate-effect, etc.)
└─ Loading state?
   ├─ Content loading → Use shadcn skeleton
   ├─ Button loading → Use Lucide Loader2 + animate-spin
   └─ Multi-step loading → Use Aceternity multi-step-loader
```

---

### 6.4 Component Naming Conventions

**File Naming**:
```
PascalCase:     TradingPanel.tsx  (React components)
kebab-case:     index-card.tsx    (shadcn convention)
```

**Component Exports**:
```tsx
// Named export (preferred for custom components)
export function TradingPanel() { ... }

// Default export (used by some shadcn components)
export default function Button() { ... }
```

**Prop Interfaces**:
```tsx
// Suffix with Props
interface TradingPanelProps {
  indexId: string;
  onTrade: () => void;
}

export function TradingPanel({ indexId, onTrade }: TradingPanelProps) { ... }
```

---

### 6.5 Component Composition Patterns

**Container/Presenter Pattern**:
```tsx
// Container (data fetching)
function TradingPanelContainer({ indexId }: { indexId: string }) {
  const { data } = useIndexData(indexId);
  return <TradingPanel data={data} />;
}

// Presenter (pure UI)
function TradingPanel({ data }: { data: IndexData }) {
  return <div>...</div>;
}
```

**Compound Components**:
```tsx
// Card with subcomponents
export function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Content = function CardContent({ children }: { children: ReactNode }) {
  return <div className="card-content">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

**Render Props**:
```tsx
function DataLoader({ children }: { children: (data: Data) => ReactNode }) {
  const { data } = useData();
  return <>{children(data)}</>;
}

// Usage
<DataLoader>
  {(data) => <div>{data.value}</div>}
</DataLoader>
```

---

## 7. Integration Patterns

### 7.1 Form Integration (React Hook Form)

**With shadcn/ui Form Components**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  indexName: z.string().min(3).max(50),
  symbol: z.string().min(2).max(10).toUpperCase(),
});

export function CreateIndexForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      indexName: '',
      symbol: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="indexName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Index Name</FormLabel>
              <FormControl>
                <Input placeholder="Dog Memes Index" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create Index</Button>
      </form>
    </Form>
  );
}
```

---

### 7.2 Data Table Integration (TanStack Table)

**With shadcn/ui Table Component**:
```tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  value: number;
}

const columns = [
  { accessorKey: 'symbol', header: 'Symbol' },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'value', header: 'Value' },
];

export function PositionsTable({ data }: { data: Position[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### 7.3 Toast Notification Integration

**With react-hot-toast (ToastProvider)**:
```tsx
import toast from 'react-hot-toast';

// Success toast
toast.success('Order placed successfully!');

// Error toast
toast.error('Failed to place order');

// Custom toast
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-card p-4 rounded-lg`}>
    <h3>Custom Toast</h3>
    <p>Message here</p>
  </div>
));

// Promise toast
toast.promise(
  placeOrder(),
  {
    loading: 'Placing order...',
    success: 'Order placed!',
    error: 'Failed to place order',
  }
);
```

---

### 7.4 Modal/Dialog Patterns

**Simple Confirmation Dialog**:
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Complex Form Dialog**:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function CreateIndexDialog({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Index</DialogTitle>
        </DialogHeader>
        <CreateIndexForm />
      </DialogContent>
    </Dialog>
  );
}
```

---

### 7.5 Responsive Design Patterns

**Mobile-First Approach**:
```tsx
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
">
  <Sidebar className="w-full md:w-64" />
  <MainContent className="flex-1" />
</div>
```

**Conditional Rendering for Mobile**:
```tsx
import { useMediaQuery } from '@/hooks/use-media-query';

export function TradingPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {isMobile ? (
        <MobileTradingLayout />
      ) : (
        <DesktopTradingLayout />
      )}
    </>
  );
}
```

**Sheet for Mobile, Dialog for Desktop**:
```tsx
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ResponsiveModal({ open, onOpenChange, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

---

### 7.6 Dark Mode Integration

**With next-themes**:
```tsx
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </Button>
  );
}
```

**Theme-Aware Components**:
```tsx
import { useTheme } from 'next-themes';

export function ThemedChart() {
  const { theme } = useTheme();

  const chartOptions = {
    ...baseOptions,
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  };

  return <Chart options={chartOptions} />;
}
```

---

## 8. Cleanup Recommendations

### 8.1 Duplicate Components to Remove

**Duplicate Wallet Components**:
- Keep: `ConnectButton.tsx`, `WalletInfo.tsx`, `NetworkSelector.tsx`
- Remove: `WalletButton.tsx`, `connect-wallet.tsx`, `wallet-dropdown.tsx`

**Duplicate Chart Components**:
- Keep: `ChartArea.tsx` (TradingView integrated)
- Remove: `ChartAreaOld.tsx` (legacy)

**Duplicate Trading Panels**:
- Keep: `TradingPanelSimple.tsx` (current)
- Remove or archive: `TradingPanel.tsx` (legacy), `trade-panel.tsx` (alternative)

**Duplicate MagicUI/Aceternity**:
- MagicUI `globe.tsx` vs Aceternity `globe.tsx` (consolidate)
- MagicUI `meteors.tsx` vs Aceternity `meteors.tsx` (consolidate)
- MagicUI `animated-gradient-text.tsx` vs Aceternity version (keep MagicUI)

---

### 8.2 Unused Aceternity Components

**Likely Unused** (verify before removing):
- `3d-marquee.tsx` - 3D rotating marquee (marketing only)
- `apple-cards-carousel.tsx` - Apple-style carousel (not in use)
- `container-text-flip.tsx` - Text flip on scroll (not in use)
- `evervault-card.tsx` - Card encryption effect (decorative)
- `google-gemini-effect.tsx` - Gemini animation (decorative)
- `images-slider.tsx` - Image slider (not in use)
- `lamp.tsx` - Lamp light effect (decorative)
- `macbook-scroll.tsx` - MacBook frame scroll (marketing)
- `shooting-stars.tsx` - Shooting stars (decorative)
- `wavy-background.tsx` - Wave animation (marketing)

**Recommendation**: Move unused Aceternity components to `/components/ui/unused/` for future reference, or delete if confident they won't be used.

---

### 8.3 Component Organization

**Proposed Folder Restructure**:
```
/components
  /ui                     # shadcn/ui only (52 components)
  /aceternity             # Aceternity UI (84 components)
    /backgrounds          # Background effects
    /cards                # Card effects
    /text                 # Text effects
    /interactive          # Interactive effects
    /scroll               # Scroll animations
    /nav                  # Navigation components
  /magicui                # MagicUI (14 components)
  /trading                # Trading-specific (clean up duplicates)
  /portfolio              # Portfolio-specific
  /governance             # Governance
  /wallet                 # Wallet (clean up duplicates)
  /launch                 # Index creation
  /settings               # Settings
  /notifications          # Notifications
  /dialogs                # Reusable dialogs
  /mobile                 # Mobile-specific
  /sidebar                # Sidebar
  /layout                 # Header/Footer
  /providers              # Context providers
```

---

**Last Updated**: 2025-11-05
**Total Components**: 253
**Status**: Catalog complete, cleanup recommendations provided
