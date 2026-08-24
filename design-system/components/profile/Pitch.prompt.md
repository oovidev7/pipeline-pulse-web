Position pitch from the player profile — navy field, emerald dots sized by share of minutes, halo + attack-direction arrow on the primary position.

```jsx
<Pitch
  width={160}
  primary="ST"
  dots={[
    { position: 'ST', percentage: 62 },
    { position: 'LW', percentage: 24 },
    { position: 'AM', percentage: 9 },
  ]}
  ariaLabel="Plays as Striker, Left Winger, Attacking Midfielder"
/>
```

160px wide in the hero stats strip; up to ~440px as the overview heatmap. Positions: GK LB CB RB LM CM RM AM LW ST RW.
