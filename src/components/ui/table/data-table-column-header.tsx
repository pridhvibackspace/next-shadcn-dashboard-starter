'use client';

import type { Column } from '@tanstack/react-table';
import { EyeOff } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CaretSortIcon,
  Cross2Icon
} from '@radix-ui/react-icons';

/**
 * Props for the DataTableColumnHeader component
 * 
 * @template TData - The type of data in the table row
 * @template TValue - The type of value in this specific column
 */
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  /** The TanStack Table column instance with sorting and visibility controls */
  column: Column<TData, TValue>;
  /** The display title for the column header */
  title: string;
}

/**
 * Interactive column header component for data tables
 * 
 * This component provides a clickable column header with dropdown menu
 * containing sorting and visibility controls. Features include:
 * - Visual sorting indicators (asc/desc/unsorted)
 * - Sorting controls (ascending, descending, reset)
 * - Column visibility toggle
 * - Responsive design with proper accessibility
 * 
 * The component automatically adapts its functionality based on the
 * column's capabilities (canSort, canHide) and current state.
 * 
 * @template TData - The type of data in the table row
 * @template TValue - The type of value in this specific column
 * @param props - Component props
 * @param props.column - The TanStack Table column instance
 * @param props.title - Display title for the column
 * @param props.className - Additional CSS classes
 * 
 * @returns An interactive column header with sorting and visibility controls
 * 
 * @example
 * ```tsx
 * // In a column definition
 * {
 *   accessorKey: 'name',
 *   header: ({ column }) => (
 *     <DataTableColumnHeader column={column} title="Name" />
 *   ),
 * }
 * ```
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
          className
        )}
        {...props}
      >
        {title}
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDownIcon />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUpIcon />
          ) : (
            <CaretSortIcon />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-28'>
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              checked={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUpIcon />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              checked={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDownIcon />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className='[&_svg]:text-muted-foreground pl-2'
                onClick={() => column.clearSorting()}
              >
                <Cross2Icon />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
