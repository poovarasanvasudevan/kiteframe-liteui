import type * as React from 'react';

export type DataRow = Record<string, any> | React.ReactNode[];
export type DataColumn<Row extends DataRow = DataRow> = string | { key: string; label: string; render?: (row: Row, index: number) => React.ReactNode };
export interface DataTableProps<Row extends DataRow = DataRow> {
  columns?: DataColumn<Row>[];
  rows?: Row[];
  empty?: React.ReactNode;
  onRowClick?: (row: Row, index: number) => void;
  getRowId?: (row: Row, index: number) => React.Key;
  caption?: string;
  className?: string;
}

export function DataTable<Row extends DataRow = DataRow>({ columns = [], rows = [], empty = 'No data available', onRowClick, getRowId = (row, index) => !Array.isArray(row) && row.id != null ? String(row.id) : index, caption, className = '' }: DataTableProps<Row>) {
  return <div className={`ad-table-wrap ${className}`.trim()}><table className="ad-table">
    {caption && <caption className="ad-table-caption">{caption}</caption>}
    <thead><tr>{columns.map((raw, index) => { const column = typeof raw === 'string' ? { key: String(index), label: raw } : raw; return <th scope="col" key={column.key}>{column.label}</th>; })}</tr></thead>
    <tbody>{rows.length ? rows.map((row, index) => <tr key={getRowId(row, index)} className={onRowClick ? 'ad-table-row-action' : undefined} tabIndex={onRowClick ? 0 : undefined} onClick={() => onRowClick?.(row, index)} onKeyDown={event => { if (onRowClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onRowClick(row, index); } }}>
      {columns.map((raw, columnIndex) => { const column = typeof raw === 'string' ? { key: String(columnIndex), label: raw } : raw; const value = 'render' in column && column.render ? column.render(row, index) : Array.isArray(row) ? row[columnIndex] : row[column.key]; return <td key={column.key}>{value as React.ReactNode}</td>; })}
    </tr>) : <tr><td className="ad-empty" colSpan={Math.max(1, columns.length)}>{empty}</td></tr>}</tbody>
  </table></div>;
}
