import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

/**
 * Props for the DataTable component
 * 
 * @template TData - The type of data displayed in each table row
 */
interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  /** The TanStack Table instance containing data, columns, and state */
  table: TanstackTable<TData>;
  /** Optional action bar component displayed when rows are selected */
  actionBar?: React.ReactNode;
}

/**
 * A comprehensive data table component built on top of TanStack Table
 * 
 * This component provides a full-featured data table with:
 * - Scrollable content area with sticky headers
 * - Column pinning support with proper styling
 * - Integrated pagination controls
 * - Optional action bar for selected rows
 * - Responsive design with horizontal scrolling
 * - Empty state handling
 * 
 * The table automatically handles rendering of headers, cells, and pagination
 * based on the provided TanStack Table instance configuration.
 * 
 * @template TData - The type of data displayed in each table row
 * @param props - Component props
 * @param props.table - The TanStack Table instance
 * @param props.actionBar - Optional action bar shown when rows are selected
 * @param props.children - Additional content rendered above the table
 * 
 * @returns A complete data table with pagination and optional action bar
 * 
 * @example
 * ```tsx
 * const table = useReactTable({
 *   data: users,
 *   columns: userColumns,
 *   // ... other table options
 * });
 * 
 * <DataTable 
 *   table={table}
 *   actionBar={<BulkActionsBar />}
 * >
 *   <DataTableToolbar table={table} />
 * </DataTable>
 * ```
 */
export function DataTable<TData>({
  table,
  actionBar,
  children
}: DataTableProps<TData>) {
  return (
    <div className='flex flex-1 flex-col space-y-4'>
      {children}
      <div className='relative flex flex-1'>
        <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
          <ScrollArea className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column })
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column })
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
