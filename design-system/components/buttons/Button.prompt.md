Standard Sentrum button for all actions; default variant is the near-black primary fill.

```jsx
<Button>Save report</Button>
<Button variant="accent">Send</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon"><SomeIcon /></Button>
```

Variants: `primary` (stone-900 fill), `accent` (slate-600 — chat Send / key CTA), `secondary` (light gray, scales up 2% on hover), `outline`, `ghost`, `destructive`. Sizes: `sm` (32px), `default` (36px), `lg` (40px), `icon` (square). Inline SVG children are auto-sized to 16px.
