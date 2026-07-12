# Glakulin

Personal website built with **Nuxt 4** using **Atomic Design** and **CSS-in-JS**.

## Architecture

The project is built on **Atomic Design** with a custom **CSS-in-JS** system via the `Style` component and `use_css()` composable. All components are auto-imported thanks to Nuxt.

Components are divided into two levels:
- **Atoms** — basic reusable elements (`Style`, `Flex`, `Grid`, `Text`, `Icon`).
- **Molecules** — composite components built from atoms (`Section`, `Masonry`, `LinkText`).

## File Structure

```
app/
├── app.vue                 # Entry point
├── global.css              # Global styles
├── tokens.ts               # Design tokens
├── utilities.ts            # Utilities (color, size, etc.)
├── composables/
│   ├── use_css.ts          # CSS-in-JS composable
│   └── use_window_size.ts  # Reactive window size
├── components/
│   ├── atoms/              # Basic components
│   └── molecules/          # Composite components
└── pages/
    └── index.vue           # Home page
```

## Design Tokens (`tokens.ts`)

Centralized storage for design decisions: colors, typography, sizes, transitions.

### Colors
Available palettes: `gray`, `accent`, `error`, `warning`, `success`, `info`. Each contains shades from `1` (light) to `9` (dark). Format: `"name_shade"`, e.g., `"accent_5"`, `"gray_1"`.

### Screen Sizes
`default` (390px), `xs` (576px), `sm` (768px), `md` (1024px), `lg` (1440px), `xl` (1920px).

### Typography
- **heading** — `IBM Plex Serif` (sizes: `default`, `xs`, `sm`, `md`, `lg`, `xl`)
- **body** — `IBM Plex Sans` (sizes: `default`, `xs`, `sm`, `md`, `lg`, `xl`)
- **mono** — `IBM Plex Mono`

## Utilities (`utilities.ts`)

| Function | Description |
|----------|-------------|
| `get_rem(value)` | Converts pixels to rem. Accepts `number` or `number[]` for shorthand properties (e.g., `[8, 16]` → `"0.5rem 1rem"`). |
| `get_color(scheme)` | Returns CSS color from tokens. Format: `"name_shade"`. |
| `get_size(width)` | Returns current breakpoint (`Size`) by screen width. |

**Types:**
- `Tag` — HTML tag or Vue component.
- `Number_Rem` — `number` or `readonly number[]`.

---

## Components

### Atoms

#### `Style`
Base component for applying CSS-in-JS styles.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `Tag` | `"div"` | HTML tag or Vue component |
| `css` | `Css_Rule` | — | Style object |

```vue
<Style tag="button" :css="{ color: 'red', hover: { color: 'blue' } }">
  Button
</Style>
```

#### `Flex`
Container for flexbox layout.

| Prop | Type | Description |
|------|------|-------------|
| `tag` | `Tag` | HTML tag or component |
| `inline` | `boolean` | `inline-flex` instead of `flex` |
| `direction` | `CSSProperties["flexDirection"]` | Axis direction |
| `wrap` | `CSSProperties["flexWrap"]` | Line wrapping |
| `justify_items` | `CSSProperties["justifyItems"]` | Horizontal alignment |
| `align_items` | `CSSProperties["alignItems"]` | Vertical alignment |
| `justify_content` | `CSSProperties["justifyContent"]` | Horizontal content distribution |
| `align_content` | `CSSProperties["alignContent"]` | Vertical content distribution |
| `gap` | `Number_Rem` | Space between elements |
| `padding` | `Number_Rem` | Inner padding |
| `radius` | `Number_Rem` | Border radius |
| `css` | `Css_Rule` | Additional styles |

```vue
<Flex direction="column" :gap="16" :padding="24">
  <div>Element 1</div>
  <div>Element 2</div>
</Flex>
```

#### `Grid`
Container for CSS Grid layout.

| Prop | Type | Description |
|------|------|-------------|
| `tag` | `Tag` | HTML tag or component |
| `inline` | `boolean` | `inline-grid` instead of `grid` |
| `template_columns` | `CSSProperties["gridTemplateColumns"]` | Column definition |
| `template_rows` | `CSSProperties["gridTemplateRows"]` | Row definition |
| `template_areas` | `CSSProperties["gridTemplateAreas"]` | Named areas |
| `auto_flow` | `CSSProperties["gridAutoFlow"]` | Auto-fill flow |
| `auto_columns` | `CSSProperties["gridAutoColumns"]` | Auto-column size |
| `auto_rows` | `CSSProperties["gridAutoRows"]` | Auto-row size |
| `justify_items` | `CSSProperties["justifyItems"]` | Horizontal element alignment |
| `align_items` | `CSSProperties["alignItems"]` | Vertical element alignment |
| `justify_content` | `CSSProperties["justifyContent"]` | Horizontal content alignment |
| `align_content` | `CSSProperties["alignContent"]` | Vertical content alignment |
| `gap` | `Number_Rem` | Gap |
| `padding` | `Number_Rem` | Inner padding |
| `radius` | `Number_Rem` | Border radius |
| `css` | `Css_Rule` | Additional styles |

```vue
<Grid template_columns="repeat(3, 1fr)" :gap="16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>
```

#### `Text`
Component for text blocks with design token support.

| Prop | Type | Description |
|------|------|-------------|
| `tag` | `Tag` | HTML tag or component |
| `family` | `"heading" \| "body"` | Font family |
| `size` | `Size` | Size (`default`, `xs`, `sm`, `md`, `lg`, `xl`) |
| `mono` | `boolean` | Monospace font |
| `color` | `Color_Scheme` | Color (e.g., `"accent_5"`) |
| `css` | `Css_Rule` | Additional styles |

```vue
<Text tag="h1" family="heading" size="xl" color="gray_1">
  Heading
</Text>
<Text family="body" size="sm" mono>
  Monospace text
</Text>
```

#### `Icon`
Component for icons from Nerd Fonts.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Icon name (e.g., `"nf-md-home"`) |
| `css` | `Css_Rule` | Additional styles |

```vue
<Icon name="nf-md-github" />
<Icon name="nf-fa-star" :css="{ color: 'gold', fontSize: '24px' }" />
```

---

### Molecules

#### `Section`
Section wrapper with heading and anchor.

| Prop | Type | Description |
|------|------|-------------|
| `anchor` | `string` | ID for anchor link |
| `css` | `Css_Rule` | Additional styles |

**Slots:**
- `heading` — heading content (default: icon + "Section")
- `default` — section content

```vue
<Section anchor="about">
  <template #heading>
    <Icon name="nf-md-account" /> About Me
  </template>
  <p>Section content...</p>
</Section>
```

#### `Masonry`
Masonry layout (tile-based).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"vertical" \| "horizontal"` | — | Layout direction |
| `columns` | `number` | `1` | Number of columns (for `vertical`) |
| `rows` | `number` | `1` | Number of rows (for `horizontal`) |
| `justify_items` | `CSSProperties["justifyItems"]` | — | Horizontal alignment |
| `align_items` | `CSSProperties["alignItems"]` | — | Vertical alignment |
| `gap` | `Number_Rem` | — | Gap |
| `padding` | `Number_Rem` | — | Inner padding |
| `radius` | `Number_Rem` | — | Border radius |
| `css` | `Css_Rule` | — | Additional styles |

```vue
<Masonry mode="vertical" :columns="3" :gap="16">
  <div v-for="item in items" :key="item.id">
    {{ item.content }}
  </div>
</Masonry>
```

#### `LinkText`
Text link with color support and automatic external link detection.

| Prop | Type | Description |
|------|------|-------------|
| `href` | `string` | Link URL |
| `color` | `Color_Scheme` | Text color |
| `color_hover` | `Color_Scheme` | Hover color |
| `disabled` | `boolean` | Disabled state (no pointer, dimmed, no interaction) |
| `css` | `Css_Rule` | Additional styles |

External links automatically open in a new tab with a ↗ icon.

```vue
<LinkText href="/about" color="gray_1" color_hover="accent_3">
  About
</LinkText>
<LinkText href="https://github.com" color="gray_1" color_hover="accent_3">
  GitHub
</LinkText>
```

#### `Button`
Button built on `Flex` + `Text`. Renders as `button` by default, or any tag/component (e.g. `NuxtLink`) via `tag`. Padding and gap scale with `size`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `Tag` | `"button"` | HTML tag or component |
| `style` | `"background" \| "outline" \| "outline_alt"` | `"background"` | Visual variant |
| `size` | `Size` | `"default"` | Size (`default` → `xl`) |
| `mono` | `boolean` | `false` | Monospace font |
| `color` | `Color_Scheme` | `"gray_9"` | Text color |
| `color_hover` | `Color_Scheme` | `"gray_9"` | Text color on hover |
| `background` | `Color_Scheme` | `"gray_1"` | Background / hover-fill color |
| `background_hover` | `Color_Scheme` | `"gray_3"` | Background on hover (`style="background"`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `css` | `Css_Rule` | — | Additional styles |

**Style variants:**
- `background` — filled button; hover changes background to `background_hover` and text to `color_hover`.
- `outline` — transparent background with `color` border; hover changes text and border to `color_hover`.
- `outline_alt` — like `outline`, but hover fills background with `background` (text color unchanged).

```vue
<Button>Send</Button>

<Button :tag="NuxtLink" to="/about" size="md" mono>
  Details
</Button>

<Button :style="'outline'" color="accent_5">
  Outline
</Button>

<Button :style="'outline_alt'" color="accent_5" background="accent_1">
  Outline Alt
</Button>

<Button :disabled="true" background="gray_3">
  Disabled
</Button>
```