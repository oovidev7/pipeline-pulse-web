Segmented tab switcher (player profile tabs, data views).

```jsx
<Tabs
  tabs={[{ value: 'overview', label: 'Overview' }, { value: 'stats', label: 'Stats' }]}
  defaultValue="overview"
  onValueChange={setTab}
/>
```

Renders only the tab list — pair with your own panel switching.
