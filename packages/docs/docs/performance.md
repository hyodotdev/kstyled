---
sidebar_position: 5
---

# Performance

## Benchmark results

kstyled transforms styles at compile time, resulting in zero runtime overhead compared to traditional CSS-in-JS libraries.

### Bundle size comparison

| Library | Bundle Size (minified) | Packages Required |
|---------|----------------------|-------------------|
| **kstyled** | ~10 KB | 1 package: `kstyled` |
| **@emotion/native** | ~13-18 KB | 3 packages: `@emotion/native` + `@emotion/primitives-core` + `@emotion/react`* |
| **styled-components/native** | ~21 KB | 1 package: `styled-components` (includes both web & native) |

*\*@emotion/react is a required peer dependency for @emotion/native to work*

**Key insights:**
- **kstyled is the smallest** at ~10 KB with everything in one package
- **@emotion/native requires 3 separate packages** totaling ~13-18 KB:
  - `@emotion/native`: ~1 KB (just a wrapper)
  - `@emotion/primitives-core`: ~7 KB (core functionality)
  - `@emotion/react`: ~5-10 KB (required peer dependency)
  - The often-cited "~8 KB" only counts 2 of the 3 required packages
  - Actual runtime bundle is 60-80% larger than advertised
- **styled-components** is ~21 KB in one package with the most complete feature set
  - Includes both web and native in the same npm package
  - Use `styled-components/native` import path for React Native

*Additional note: styled-components and emotion also depend on `css-to-react-native` (~25 KB) for runtime CSS parsing.*

### Rendering performance

kstyled uses native `StyleSheet.create()` which is optimized by React Native:

- **Static styles**: Pre-compiled to StyleSheet objects (zero runtime cost)
- **Dynamic styles**: Minimal runtime computation for prop-based styles
- **No parsing**: CSS is parsed at build time, not runtime

## When kstyled shines

kstyled provides the most benefit in these scenarios:

### Large lists

Rendering many components with complex styles:

```tsx
const Item = styled(View)`
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  shadow-color: #000;
  shadow-opacity: 0.1;
  elevation: 3;
`;

// Rendering 1000+ items - kstyled has no per-render cost
<FlatList
  data={items}
  renderItem={({ item }) => <Item>{item.content}</Item>}
/>
```

### Static-heavy components

Components with mostly static styles:

```tsx
// All these styles are compiled at build time
const Card = styled(View)`
  padding: 20px;
  margin: 12px;
  border-radius: 12px;
  background-color: white;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;
```

### Complex nested styles

Deep component trees with many styled elements:

```tsx
const Page = styled(View)`...`;
const Section = styled(View)`...`;
const Card = styled(View)`...`;
const Header = styled(View)`...`;
const Title = styled(Text)`...`;
const Body = styled(Text)`...`;

// No runtime parsing overhead for any of these
```

## Optimization tips

### Prefer static styles

More static = better performance:

```tsx
// Good - mostly static
const Button = styled(Pressable)<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${p => p.$primary ? '#007AFF' : '#ccc'};
`;

// Less optimal - everything dynamic
const Button = styled(Pressable)<{ $padding?: number; $radius?: number }>`
  padding: ${p => p.$padding || 12}px;
  border-radius: ${p => p.$radius || 8}px;
`;
```

### Use StyleSheet for inline styles

For truly dynamic styles, use React Native's StyleSheet:

```tsx
const Item = styled(View)`
  padding: 16px;
  border-radius: 8px;
`;

function MyItem({ color }: { color: string }) {
  return (
    <Item style={{ backgroundColor: color }}>
      {/* ... */}
    </Item>
  );
}
```

### Memoize dynamic styles

If you have expensive style computations:

```tsx
const getButtonColor = (variant: string) => {
  // Expensive computation
  return computeColor(variant);
};

const Button = styled(Pressable)<{ $variant: string }>`
  padding: 12px;
  background-color: ${p => getButtonColor(p.$variant)};
`;

// Consider memoizing or pre-computing
```

## Measuring performance

Use the example app's benchmark screen to compare:

```bash
cd packages/example
pnpm start
```

Navigate to "Performance" to see real-time comparisons between kstyled, styled-components, and emotion.

## Real-world impact

Based on our benchmark tests with 50 complex cards (each containing multiple styled components, dynamic props, and nested elements):

- **Rendering performance**: kstyled is approximately **8-15% faster**
  - vs emotion: ~15% faster (477ms vs 561ms median)
  - vs styled-components: ~8% faster (183ms vs 199ms median)

### Benchmark Results

Below are real benchmark results from our test app rendering 50 complex cards:

<div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem'}}>

<div style={{flex: '1', minWidth: '300px'}}>

#### kstyled vs emotion

<details>
<summary>View screenshot</summary>

![kstyled vs emotion benchmark](/img/vs-emotion-css.png)

</details>

| Metric | kstyled | emotion |
|--------|---------|---------|
| **Median** | **477.74ms** | **561.23ms** |
| Mean | 482.43ms | 565.34ms |
| Min / Max | 476.66ms / 494.44ms | 544.33ms / 592.24ms |
| P95 | 494.15ms | 585.37ms |
| Std Dev | ±7.55ms | ±12.32ms |

**Result: 14.9% faster** ⚡

</div>

<div style={{flex: '1', minWidth: '300px'}}>

#### kstyled vs styled-components

<details>
<summary>View screenshot</summary>

![kstyled vs styled-components benchmark](/img/vs-styled-components.png)

</details>

| Metric | kstyled | styled-components |
|--------|---------|-------------------|
| **Median** | **182.94ms** | **199.47ms** |
| Mean | 186.21ms | 193.26ms |
| Min / Max | 182.37ms / 215.84ms | 182.33ms / 201.51ms |
| P95 | 201.20ms | 200.82ms |
| Std Dev | ±9.88ms | ±8.35ms |

**Result: 8.3% faster** ⚡

</div>

</div>

**Test configuration:**
- 50 cards per benchmark
- 10 iterations per library (3 warm-up iterations discarded)
- Randomized order each iteration
- Each card contains multiple styled components with both static and dynamic styles

### Why is kstyled faster?

The performance advantage comes from **build-time optimization**:

#### What kstyled does differently

```tsx
// This code:
const Box = styled(View)`
  padding: 16px;
  border-radius: 12px;
  background-color: ${p => p.$selected ? '#007AFF' : '#FFF'};
`;

// Is compiled at build time to:
const styles = StyleSheet.create({
  s0: { padding: 16, borderRadius: 12 }
});

const Box = (props) => {
  const dynamicStyle = {
    backgroundColor: props.$selected ? '#007AFF' : '#FFF'
  };
  return <View style={[styles.s0, dynamicStyle]} {...props} />;
};
```

#### The key differences

1. **Static style extraction**: kstyled separates static styles and compiles them to `StyleSheet.create()` at build time, while runtime CSS-in-JS libraries parse all template literals at runtime.

2. **Simpler runtime**: kstyled's runtime just applies pre-computed styles, while styled-components/emotion need to parse CSS syntax, handle interpolations, and manage style caching on every component mount.

3. **Smaller overhead per component**: Each styled component instance in kstyled has less work to do at runtime.

### Performance characteristics

The **8-15% improvement** is consistent across different types of components:
- Components with mostly static styles benefit from build-time compilation
- Components with dynamic styles still benefit from faster component instantiation and lighter runtime overhead
- The improvement is most noticeable when rendering many components (e.g., long lists)

### Important notes

- Both kstyled and runtime CSS-in-JS libraries are highly optimized
- Performance differences are **measurable but modest** in real-world apps
- Choose based on your needs:
  - Want maximum performance → kstyled
  - Need maximum runtime flexibility → runtime CSS-in-JS
  - Both are production-ready and performant options
