Follow-up suggestion chips rendered after an assistant reply, under a hairline divider with the "KEEP EXPLORING" eyebrow.

```jsx
<FollowUpChips
  suggestions={[
    { label: 'Only U21 players', query: 'Filter to U21 players only' },
    { label: 'Compare with last season' },
  ]}
  onSelect={sendMessage}
/>
```
