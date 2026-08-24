The standard table for query results, standings and player lists.

```jsx
<DataTable
  columns={[
    { key: 'player', label: 'Player' },
    { key: 'club', label: 'Club' },
    { key: 'goals', label: 'Goals', numeric: true, align: 'right' },
  ]}
  rows={[{ player: 'L. Martínez', club: 'Inter', goals: 21 }]}
  onRowClick={row => openPreview(row)}
/>
```

Headers render as uppercase micro-labels. Pass `numeric: true` for stat columns so digits align. `onRowClick` enables the hover/pointer treatment used for player drill-ins.
