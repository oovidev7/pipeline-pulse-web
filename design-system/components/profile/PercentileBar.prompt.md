Percentile bar for metric rows (performance snapshot, metric lists). Tier colors: ≥90 `--tier-elite`, ≥75 `--tier-above-avg`, ≥50 `--tier-average`, ≥25 `--tier-below-avg`, else `--tier-low`.

```jsx
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <span>Successful dribbles / 90</span><span>5.8 · P92</span>
</div>
<PercentileBar percentile={92} style={{ marginTop: 6 }} />
```
