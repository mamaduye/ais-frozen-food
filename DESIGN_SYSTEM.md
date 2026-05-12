# AIS Frozen Food - Design System Documentation

## Overview
This document outlines the unified design system implemented across all pages of the AIS Frozen Food ecommerce platform. The system ensures consistency, accessibility, and maintainability across the entire application.

## Color Palette

### Primary Colors
- **Primary (Frozen Blue)**: `oklch(0.62 0.13 235)`
  - Used for primary actions, CTAs, and brand elements
  - Foreground: `oklch(0.99 0 0)` (white)

- **Accent (Deep Navy)**: `oklch(0.32 0.07 250)`
  - Used for highlights and secondary brand elements
  - Foreground: `oklch(0.99 0 0)` (white)

### Neutral Colors
- **Background**: `oklch(1 0 0)` (white)
  - Light mode: white
  - Dark mode: `oklch(0.18 0.02 240)`

- **Secondary**: `oklch(0.96 0.015 235)` (light blue-gray)
  - Used for secondary backgrounds and hover states
  - Dark mode: `oklch(0.28 0.03 240)`

- **Muted**: `oklch(0.97 0.01 235)`
  - Used for disabled states and secondary text
  - Dark mode: `oklch(0.28 0.03 240)`

### Semantic Colors
- **Destructive**: `oklch(0.577 0.245 27.325)` (red)
  - Used for delete, cancel, and error states

- **Border**: `oklch(0.92 0.01 235)` (light blue-gray border)
  - Consistent border color across all components

## Typography

### Font Families
- **Display (Headings)**: Plus Jakarta Sans
  - Used for h1-h6, titles, and bold text
  - Weights: semibold (600)

- **Sans (Body)**: Inter
  - Used for body text, descriptions, and UI labels
  - Regular weight for body text
  - Medium/semibold for labels

### Type Scale

```
h1: 2.25rem (36px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: tight (1.2)
  - Tracking: tight (-0.02em)

h2: 1.875rem (30px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: tight (1.2)
  - Tracking: tight (-0.02em)

h3: 1.5rem (24px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: snug (1.375)
  - Tracking: tight (-0.02em)

h4: 1.25rem (20px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: snug (1.375)

h5: 1rem (16px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: normal (1.5)

h6: 0.875rem (14px)
  - Font: Plus Jakarta Sans, semibold
  - Line height: normal (1.5)

body: 1rem (16px)
  - Font: Inter, regular
  - Line height: relaxed (1.625)

body-sm: 0.875rem (14px)
  - Font: Inter, regular
  - Line height: relaxed (1.625)

caption: 0.75rem (12px)
  - Font: Inter, regular
  - Line height: normal (1.5)
```

## Spacing System

All spacing uses a consistent scale based on 4px base unit:

```
xs:   2px
sm:   4px
md:   8px
lg:   16px
xl:   24px
2xl:  32px
3xl:  48px
4xl:  64px
```

### Spacing Usage

#### Sections
- `section-padding`: `px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16`
  - Used on major content sections

#### Padding Standards
- Card padding: `p-6` (24px)
- Input/Field padding: `px-4 py-2.5` (16px horizontal, 10px vertical)
- Button padding: `px-6 py-2.5` (24px horizontal, 10px vertical)
- Section internal spacing: `gap-6` to `gap-8`

#### Gaps
- Between grid items: `gap-6` or `gap-8`
- Between flex items: `gap-3` to `gap-6` depending on context
- List items: `space-y-2` to `space-y-4`

## Border Radius

Consistent border radius for a cohesive, modern appearance:

```
sm: 0.375rem (6px)
md: 0.5rem (8px)
lg: 0.75rem (12px) - DEFAULT
xl: 1rem (16px)
2xl: 1.5rem (24px) - For featured cards only
```

### Usage
- **Default (rounded-lg)**: Cards, buttons, inputs, modals
- **Featured (rounded-2xl)**: Hero sections, featured product cards only
- **Full (rounded-full)**: Badges, avatars, toggle buttons

## Shadows & Elevation

```
sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
  - Used for subtle hover states on interactive elements

md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
  - Used for standard cards and floating elements

lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
  - Used for modals and important floating elements
```

## Components

### Buttons

All buttons use consistent spacing and styling:

```tsx
// Primary button
<button className="btn-primary">Action</button>

// Secondary button
<button className="btn-secondary">Secondary</button>

// Ghost button (minimal)
<button className="btn-ghost">Ghost</button>

// Destructive button
<button className="btn-destructive">Delete</button>

// Size variants
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary btn-lg">Large</button>
```

**Styles:**
- Base: `inline-flex items-center justify-center gap-2 rounded-lg font-semibold`
- Padding: `px-6 py-2.5` (default), `px-4 py-1.5` (sm), `px-8 py-3` (lg)
- Hover: All buttons have smooth transitions with `duration-200`
- Focus: Ring offset ring on focus (consistent across all variants)
- Disabled: `opacity-50 cursor-not-allowed`

### Cards

```tsx
// Base card
<div className="card-base">Content</div>

// Interactive card (with hover effects)
<div className="card-interactive">Clickable card</div>
```

**Styles:**
- Border: `border border-border`
- Border radius: `rounded-lg`
- Background: `bg-card`
- Foreground: `text-card-foreground`
- Interactive adds: `hover:shadow-md hover:border-primary/30`

### Forms

All form elements use consistent styling:

```tsx
<input className="px-4 py-2.5 rounded-lg border border-input" />
<textarea className="px-4 py-2.5 rounded-lg border border-input min-h-[120px]" />
<select className="px-4 py-2.5 rounded-lg border border-input" />
```

**Focus states:**
- `focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1`

### Tables

Tables use consistent header and row styling with hover effects and zebra striping:

```
Header: bg-muted, px-4 py-3, text-sm font-semibold
Rows: border-b border-border, px-4 py-3, hover:bg-muted/50
Zebra: Every even row gets bg-muted/30
```

## Loading States

### Skeleton Component
Used for placeholder content while loading:

```tsx
import { Skeleton, SkeletonCard, SkeletonProductCard, SkeletonTableRow } from "@/components/ui/skeleton"

// Variants: card, text, avatar, button, table-row
<Skeleton variant="text" className="h-6 w-3/4" />
<SkeletonCard /> // Full card skeleton
<SkeletonProductCard /> // Product card skeleton
<SkeletonTableRow /> // Table row skeleton
```

### Loading Spinner
For general loading indication:

```tsx
import { LoadingSpinner, LoadingOverlay } from "@/components/loading-spinner"

// Sizes: sm, md, lg
<LoadingSpinner size="md" />
<LoadingSpinner fullScreen /> // Full screen spinner
<LoadingOverlay /> // Overlay spinner for modal content
```

## Empty States

Standardized empty state component:

```tsx
import { EmptyState } from "@/components/empty-state"

<EmptyState
  icon={<ShoppingBag className="h-16 w-16" />}
  title="No orders yet"
  description="Your past orders will appear here once you check out."
  action={<Button asChild><Link href="/products">Start shopping</Link></Button>}
/>
```

## Layout Utilities

### Container
```tsx
// Use on all main content containers
<div className="container-max">Content</div>
// = mx-auto max-w-7xl
```

### Spacing
```tsx
// Section padding
<section className="section-padding">Content</section>
// = px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16

// Between sections
<div className="section-spacing">
  <div>Section 1</div>
  <div>Section 2</div>
</div>
// = space-y-8

// Grid spacing
<div className="grid-spacing">Grid items</div>
// = gap-6 sm:gap-8
```

### Flex Utilities
```tsx
<div className="flex-center">Centered content</div>
// = flex items-center justify-center

<div className="flex-between">
  <div>Left</div>
  <div>Right</div>
</div>
// = flex items-center justify-between
```

## Implementation Examples

### Product Grid
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map(p => (
    <ProductCard key={p.id} product={p} />
  ))}
</div>
```

### Page Header
```tsx
<header className="border-b border-border pb-8">
  <p className="text-sm font-medium text-primary">Section label</p>
  <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">Page title</h1>
  <p className="mt-2 text-sm text-muted-foreground">Description</p>
</header>
```

### Card Section
```tsx
<section className="card-base rounded-lg p-6">
  <h2 className="font-display text-lg font-semibold">Section title</h2>
  <ul className="mt-4 space-y-3">
    {items.map(item => <li key={item.id}>{item.name}</li>)}
  </ul>
</section>
```

### Form Section
```tsx
<form className="space-y-6">
  <div>
    <label className="text-sm font-semibold">Label</label>
    <input className="mt-2 w-full px-4 py-2.5 rounded-lg border border-input" />
  </div>
  <button className="btn-primary w-full">Submit</button>
</form>
```

## Responsive Design

All components use mobile-first responsive design:

- **Base**: Mobile (default)
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)

### Common Responsive Patterns

```tsx
// Padding
<div className="px-4 sm:px-6 lg:px-8">Content</div>

// Grid columns
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">Items</div>

// Text size
<h1 className="text-3xl sm:text-4xl lg:text-5xl">Heading</h1>

// Flex direction
<div className="flex flex-col md:flex-row gap-6">
  <aside className="md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

## Accessibility

All components follow WCAG 2.1 AA standards:

- **Color contrast**: Minimum 4.5:1 for text
- **Focus states**: Visible ring on all interactive elements
- **Semantic HTML**: Proper h1-h6 hierarchy, `<button>` vs `<div>`
- **ARIA labels**: Screen reader descriptions where needed
- **Keyboard navigation**: All interactive elements keyboard accessible

### Focus Ring
Default focus ring uses the `--ring` color variable with slight transparency:
```
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

## Dark Mode

The design system includes full dark mode support using CSS variables:

```css
:root {
  /* Light mode colors */
}

.dark {
  /* Dark mode colors - automatically adjusted OKLCH values */
}
```

Use the `dark:` prefix in Tailwind for any dark-mode-specific styles.

## Maintenance & Updates

### When to update the design system:
1. **Color changes**: Update CSS variables in globals.css
2. **Typography changes**: Update heading/body styles in @layer base
3. **Spacing changes**: Update utility variables and scales
4. **Component changes**: Update component classes in @layer components
5. **New patterns**: Document in this file

### Testing consistency:
- Check all pages use `container-max` for main containers
- Verify section spacing uses defined scale
- Ensure all cards use `card-base` or `card-interactive`
- Confirm tables have hover effects and zebra striping
- Validate loading states use provided components

## Version History

- **v1.0** (May 2026): Initial design system implementation
  - Unified spacing scale
  - Typography hierarchy
  - Button, card, and form standardization
  - Table styling with hover effects
  - Loading and empty state components
