import React from 'react'

/**
 * Data table — uppercase micro-label headers, tabular numerals, optional
 * clickable rows. The standard rendering for query results in chat.
 */
export function DataTable({ columns, rows, onRowClick, className = '', style }) {
  return (
    <table
      className={`snt-table ${onRowClick ? 'snt-table--clickable' : ''} ${className}`}
      style={style}
    >
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={col.align === 'right' ? { textAlign: 'right' } : undefined}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} onClick={onRowClick ? () => onRowClick(row, i) : undefined}>
            {columns.map(col => (
              <td
                key={col.key}
                className={col.numeric ? 'snt-num' : undefined}
                style={col.align === 'right' ? { textAlign: 'right' } : undefined}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
