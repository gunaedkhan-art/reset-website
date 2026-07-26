import { cn } from "@/lib/utils";

export interface DataTableColumn {
  key: string;
  header: string;
  align?: "left" | "right";
  format?: (value: unknown) => string;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  caption?: string;
  className?: string;
  maxVisibleRows?: number;
}

export function DataTable({
  columns,
  rows,
  caption,
  className,
  maxVisibleRows = 20,
}: DataTableProps) {
  const visibleRows = rows.slice(0, maxVisibleRows);

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-neutral-200", className)}>
      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-4 py-3 font-semibold text-neutral-900",
                  column.align === "right" ? "text-right" : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {visibleRows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => {
                const raw = row[column.key];
                const cell =
                  column.format !== undefined
                    ? column.format(raw)
                    : raw === undefined || raw === null
                      ? ""
                      : String(raw);
                return (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-neutral-700",
                      column.align === "right" ? "text-right tabular-nums" : "text-left",
                    )}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxVisibleRows && (
        <p className="border-t border-neutral-100 px-4 py-2 text-xs text-neutral-500">
          Showing first {maxVisibleRows} of {rows.length} rows.
        </p>
      )}
    </div>
  );
}
