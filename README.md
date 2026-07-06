# Glakulin

Personal website built with Nuxt 3.

## Component Architecture

The project uses an **Atomic Design** approach with **CSS-in-JS** styling via the `Style.vue` component and `use_css()` composable. Components are divided into two levels:

- **Atoms** — basic, reusable components (Flex, Grid, Text, Icon, Style).
- **Molecules** — composite components built from atoms (Section, Masonry).

Components are automatically imported thanks to Nuxt auto-imports.

### Styling System

All components support the **`css` prop** for inline CSS customization. The `css` prop accepts a `Css_Rule` object that merges with the component's base styles:

```vue
<!-- Add custom styles to any component -->
<Flex direction="row" :gap="16" :css="{color: 'red', textAlign: 'center'}">
  Content
</Flex>

<!-- Styles merge with base styles -->
<Grid template_columns="1fr 1fr" :css="{minHeight: '100vh'}">
  <!-- Grid grid styles + custom minHeight -->
</Grid>
```

---

## Atoms

### Style

The base component for applying CSS-in-JS styles to any HTML element.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `keyof HTMLElementTagNameMap` | `"div"` | HTML tag to render |
| `css` | `Css_Rule` | — | CSS rules object (supports pseudo-classes, @media queries) |

**Usage Examples:**

```vue
<!-- Basic styled div -->
<Style :css="{display: 'flex', gap: 16}">
  Content
</Style>

<!-- With pseudo-classes -->
<Style
  tag="button"
  :css="{
    padding: 12,
    backgroundColor: 'blue',
    hover: { backgroundColor: 'darkblue' },
    active: { transform: 'scale(0.95)' }
  }"
>
  Click me
</Style>

<!-- With media queries -->
<Style
  :css="{
    fontSize: 16,
    '@media (max-width: 768px)': { fontSize: 14 }
  }"
>
  Responsive text
</Style>
```

---

### Flex

A component for creating flexbox containers.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inline` | `boolean` | `false` | Use `inline-flex` instead of `flex` |
| `direction` | `CSSProperties["flexDirection"]` | — | Flex direction (`row`, `column`, etc.) |
| `wrap` | `CSSProperties["flexWrap"]` | — | Flex wrapping (`wrap`, `nowrap`) |
| `justify_items` | `CSSProperties["justifyItems"]` | — | Align items horizontally |
| `align_items` | `CSSProperties["alignItems"]` | — | Align items vertically |
| `justify_content` | `CSSProperties["justifyContent"]` | — | Justify content horizontally |
| `align_content` | `CSSProperties["alignContent"]` | — | Align content vertically |
| `gap` | `Number_Rem` | — | Gap between items (in px, converted to rem) |
| `padding` | `Number_Rem` | — | Inner padding (in px) |
| `radius` | `Number_Rem` | — | Border radius (in px) |
| `css` | `Css_Rule` | — | Additional CSS styles (merges with base styles) |
| `tag` | `keyof HTMLElementTagNameMap` | `"div"` | HTML tag (passed via `$attrs`) |

**Usage Examples:**

```vue
<!-- Simple flex container with column direction and gaps -->
<Flex direction="column" :gap="16">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

<!-- Centering content -->
<Flex justify_content="center" align_items="center" :padding="24">
  <span>Centered content</span>
</Flex>

<!-- Horizontal list with wrapping -->
<Flex wrap="wrap" :gap="8">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</Flex>

<!-- Using a different HTML tag -->
<Flex tag="nav" direction="row" :gap="16">
  <a href="/">Home</a>
  <a href="/about">About</a>
</Flex>

<!-- With custom CSS -->
<Flex
  direction="column"
  :gap="16"
  :css="{minHeight: '100vh', backgroundColor: 'gray_1'}"
>
  Full-height column
</Flex>
```

---

### Grid

A component for creating grid containers.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inline` | `boolean` | `false` | Use `inline-grid` instead of `grid` |
| `template_columns` | `CSSProperties["gridTemplateColumns"]` | — | Column definitions |
| `template_rows` | `CSSProperties["gridTemplateRows"]` | — | Row definitions |
| `template_areas` | `CSSProperties["gridTemplateAreas"]` | — | Named grid areas |
| `auto_flow` | `CSSProperties["gridAutoFlow"]` | — | Auto-placement flow (`row`, `column`) |
| `auto_columns` | `CSSProperties["gridAutoColumns"]` | — | Auto-column size |
| `auto_rows` | `CSSProperties["gridAutoRows"]` | — | Auto-row size |
| `justify_items` | `CSSProperties["justifyItems"]` | — | Align items horizontally |
| `align_items` | `CSSProperties["alignItems"]` | — | Align items vertically |
| `justify_content` | `CSSProperties["justifyContent"]` | — | Justify content horizontally |
| `align_content` | `CSSProperties["alignContent"]` | — | Align content vertically |
| `gap` | `Number_Rem` | — | Gap between cells (in px) |
| `padding` | `Number_Rem` | — | Inner padding (in px) |
| `radius` | `Number_Rem` | — | Border radius (in px) |
| `css` | `Css_Rule` | — | Additional CSS styles (merges with base styles) |
| `tag` | `keyof HTMLElementTagNameMap` | `"div"` | HTML tag (passed via `$attrs`) |

**Usage Examples:**

```vue
<!-- 3-column grid -->
<Grid template_columns="repeat(3, 1fr)" :gap="16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</Grid>

<!-- Responsive grid -->
<Grid template_columns="repeat(auto-fill, minmax(200px, 1fr))" :gap="24">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</Grid>

<!-- Grid with named areas -->
<Grid
  template_areas="'header header' 'sidebar main' 'footer footer'"
  template_columns="200px 1fr"
  template_rows="auto 1fr auto"
  :gap="16"
>
  <div style="grid-area: header">Header</div>
  <div style="grid-area: sidebar">Sidebar</div>
  <div style="grid-area: main">Main Content</div>
  <div style="grid-area: footer">Footer</div>
</Grid>

<!-- With custom styles -->
<Grid
  template_columns="repeat(2, 1fr)"
  :gap="16"
  :css="{minHeight: '100%', padding: 32}"
>
  Cards go here
</Grid>
```

---

### Icon

A component for rendering icons from [Nerd Fonts](https://www.nerdfonts.com/).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Icon name (CSS class without the `nf` prefix) |
| `css` | `Css_Rule` | — | Additional CSS styles (for parent styling) |

**Usage Examples:**

```vue
<!-- Section icon -->
<Icon name="nf-md-format_section" />

<!-- GitHub icon -->
<Icon name="nf-dev-github" />

<!-- Icon inside text -->
<Text>
  <Icon name="nf-fa-star" /> Favorites
</Text>

<!-- Icon with props for parent -->
<Icon name="nf-md-close" :css="{cursor: 'pointer'}" />
```

> **Note:** Nerd Fonts must be connected in the project for icons to render correctly.

---

### Text

A component for text blocks with design token support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `family` | `"heading" \| "body"` | — | Font family |
| `size` | `Size` | — | Text size (`default`, `xs`, `sm`, `md`, `lg`, `xl`) |
| `mono` | `boolean` | `false` | Use monospace font |
| `color` | `Color_Scheme` | — | Text color (format: `name_shade`) |
| `css` | `Css_Rule` | — | Additional CSS styles (merges with base styles) |
| `tag` | `keyof HTMLElementTagNameMap` | `"p"` | HTML tag (passed via `$attrs`) |

**Available Sizes:**

| Size | Heading (px) | Body (px) |
|------|--------------|-----------|
| `default` | 40 | 12 |
| `xs` | 44 | 16 |
| `sm` | 48 | 20 |
| `md` | 56 | 28 |
| `lg` | 60 | 32 |
| `xl` | 64 | 36 |

**Usage Examples:**

```vue
<!-- Heading -->
<Text tag="h1" family="heading" size="xl">Page Title</Text>

<!-- Paragraph -->
<Text family="body" size="md">Regular paragraph text.</Text>

<!-- Monospace text -->
<Text mono size="sm">const x = 42;</Text>

<!-- Colored text -->
<Text color="accent_5">Accent text</Text>
<Text color="error_5">Error text</Text>
<Text color="success_5">Success message</Text>

<!-- Combined props -->
<Text tag="h2" family="heading" size="lg" color="gray_8">
  Secondary heading
</Text>

<!-- With custom styles -->
<Text
  family="body"
  size="md"
  :css="{textDecoration: 'underline', fontStyle: 'italic'}"
>
  Styled text
</Text>
```

---

## Molecules

### Section

A wrapper component that combines `Flex`, `Text`, and `Icon` to create a styled section.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `css` | `Css_Rule` | — | Additional CSS styles (passed to root `Flex`) |

**Slots:**

| Slot | Description |
|------|-------------|
| `default` | Main section content |
| `heading` | Custom heading with icon (default: "Section" with icon) |

**Usage Examples:**

```vue
<!-- Basic section -->
<Section>
  <p>Section content goes here</p>
</Section>

<!-- Custom heading slot -->
<Section>
  <template #heading>
    <Icon name="nf-md-folder" />
    Projects
  </template>
  <div>Project list</div>
</Section>

<!-- With custom styles -->
<Section :css="{backgroundColor: 'gray_2', padding: 32}">
  <p>Styled section</p>
</Section>
```

---

### Masonry

A component that arranges child elements in a masonry layout, measuring their dimensions and distributing them evenly across columns or rows.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"vertical" \| "horizontal"` | — | Layout direction (`vertical` = columns, `horizontal` = rows) |
| `columns` | `number` | `1` | Number of columns (in vertical mode) |
| `rows` | `number` | `1` | Number of rows (in horizontal mode) |
| `justify_items` | `CSSProperties["justifyItems"]` | — | Align items horizontally |
| `align_items` | `CSSProperties["alignItems"]` | — | Align items vertically |
| `gap` | `Number_Rem` | — | Gap between items (in px) |
| `padding` | `Number_Rem` | — | Inner padding (in px) |
| `radius` | `Number_Rem` | — | Border radius (in px) |
| `css` | `Css_Rule` | — | Additional CSS styles (merges with base styles) |
| `tag` | `keyof HTMLElementTagNameMap` | `"div"` | HTML tag (passed via `$attrs`) |

**How it Works:**

1. Measures the height/width of each child element
2. Distributes children evenly across columns/rows to minimize height/width differences
3. Re-calculates on size changes and prop updates

**Usage Examples:**

```vue
<!-- Vertical masonry layout (3 columns) -->
<Masonry mode="vertical" :columns="3" :gap="16">
  <div>Item 1</div>
  <div>Item 2 (taller)</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</Masonry>

<!-- Horizontal masonry layout (2 rows) -->
<Masonry mode="horizontal" :rows="2" :gap="24">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Masonry>

<!-- With padding and border radius -->
<Masonry
  mode="vertical"
  :columns="4"
  :gap="16"
  :padding="32"
  :radius="8"
>
  <div>Card 1</div>
  <div>Card 2</div>
  <!-- More cards -->
</Masonry>

<!-- With custom styles -->
<Masonry
  mode="vertical"
  :columns="3"
  :gap="16"
  :css="{minHeight: '100vh', backgroundColor: 'gray_1'}"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <!-- More items -->
</Masonry>
```

---

## Design Tokens

All components use centralized design tokens defined in `app/tokens.ts`. These include:

- **Colors**: Named color schemes with 9 shades each (gray, accent, error, warning, success, info)
- **Typography**: Heading and body font families with size/weight variations
- **Sizes**: Screen breakpoints and padding scales

### Using Colors

Colors are referenced using the format `{colorName}_{shade}`:

```vue
<Text color="accent_5">Accent text</Text>
<Text color="error_3">Error message</Text>
```

### Using Sizes

Numeric values in props are automatically converted to `rem` units:

```vue
<Flex :gap="16" :padding="24" :radius="8">
  <!-- 16px = 1rem, 24px = 1.5rem, 8px = 0.5rem -->
</Flex>
```

---

## CSS-in-JS System

The `use_css()` composable provides a lightweight CSS-in-JS solution with:

- **Atomic CSS generation** — unique classes for each style rule
- **Caching** — rules are cached to avoid duplication
- **Pseudo-classes** — support for hover, focus, active, etc.
- **Media queries** — responsive styles with `@media` rules
- **Nesting** — supports nested pseudo-class and media query objects

Example from `use_css()`:

```typescript
const styles = css({
  display: 'flex',
  gap: 16,
  hover: {
    backgroundColor: 'blue'
  },
  '@media (max-width: 768px)': {
    flexDirection: 'column'
  }
});
```

---

## File Structure

```
app/
├── app.vue                 # Application entry point
├── global.css              # Global styles
├── tokens.ts               # Design tokens
├── utilities.ts            # Utility functions (color, size, etc.)
├── composables/
│   └── use_css.ts         # CSS-in-JS composable
├── components/
│   ├── atoms/
│   │   ├── Style.vue       # Base styling component
│   │   ├── Flex.vue        # Flexbox container
│   │   ├── Grid.vue        # Grid container
│   │   ├── Text.vue        # Text component
│   │   ├── Icon.vue        # Icon component
│   │   └── index.ts        # Exports
│   └── molecules/
│       ├── Section.vue     # Section wrapper
│       ├── Masonry.vue     # Masonry layout
│       └── index.ts        # Exports
└── pages/
    └── index.vue           # Index page
```
```

---

## Molecules

### Section

A component for styling page sections with a heading and an icon.

**Slots:**

| Slot | Description |
|------|-------------|
| `default` | Main section content |
| `heading` | Custom heading (overrides the default) |

**Usage Examples:**

```vue
<!-- Basic usage -->
<Section>
  <p>Section content with the default "Section" heading</p>
</Section>

<!-- Custom heading -->
<Section>
  <template #heading>
    <Icon name="nf-fa-user" /> About Me
  </template>
  <p>Personal information.</p>
</Section>

<!-- Section with grid content -->
<Section>
  <template #heading>
    <Icon name="nf-dev-github" /> Projects
  </template>
  <Grid template_columns="repeat(2, 1fr)" :gap="16">
    <div>Project 1</div>
    <div>Project 2</div>
  </Grid>
</Section>
```

---

## Design Tokens

Tokens are defined in the `app/tokens.ts` file and provide centralized management of design decisions.

### Colors

The color scheme consists of 6 palettes, each with 9 shades (from light to dark):

| Palette | Description |
|---------|-------------|
| `gray` | Neutral gray shades |
| `accent` | Accent color (purple) |
| `error` | Error color (red) |
| `warning` | Warning color (yellow) |
| `success` | Success color (green) |
| `info` | Info color (blue) |

**Format:** `name_shade` (e.g., `accent_5`, `gray_1`, `error_3`)

**Examples:**
- `gray_1` — `#FFFFFF` (white)
- `gray_9` — `#000000` (black)
- `accent_5` — `#9500FF` (primary accent)
- `error_5` — `#FF2200` (error)

### Typography

| Family | Font | Purpose |
|--------|------|---------|
| `heading` | IBM Plex Serif | Headings |
| `body` | IBM Plex Sans | Main text |
| `mono` | IBM Plex Mono | Code, monospace text |

---

## Utilities

### `get_color(scheme: Color_Scheme): string`

Converts a color scheme token to a CSS color value.

```typescript
import { get_color } from "~/utilities";

const color = get_color("accent_5"); // "#9500FF"
```

### `get_rem(value: Number_Rem): string`

Converts a numeric value (in px) to rem.

```typescript
import { get_rem } from "~/utilities";

const rem = get_rem(16); // "1rem"
const remArray = get_rem([16, 24]); // "1rem 1.5rem"
```

### `use_css()`

A composable for CSS-in-JS. Creates atomic CSS classes from style objects.

```typescript
const css = use_css();

const className = css({
  display: "flex",
  flexDirection: "column",
  gap: 16, // converted to rem
  padding: [16, 24], // converted to rem
  color: get_color("gray_8"),
  hover: {
    color: get_color("accent_5")
  }
});
```

**Supported pseudo-classes:**
- `hover`
- `focus`
- `active`
- `visited`
- `disabled`
- `checked`
- `focusVisible`
- `focusWithin`

---

## Project Structure

```text
app/
├── components/
│   ├── atoms/          # Basic components
│   │   ├── Flex.vue
│   │   ├── Grid.vue
│   │   ├── Icon.vue
│   │   ├── Text.vue
│   │   └── index.ts
│   └── molecules/      # Composite components
│       ├── Section.vue
│       └── index.ts
├── composables/        # Vue composables
│   └── use_css.ts
├── pages/              # App pages
├── tokens.ts           # Design tokens
├── utilities.ts        # Utility functions
└── app.vue
```

## Setup & Running

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```