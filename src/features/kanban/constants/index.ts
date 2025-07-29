import type { Column } from '../components/board-column';

export const DEFAULT_COLUMNS = [
  {
    id: 'TODO' as const,
    title: 'Todo'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In progress'
  },
  {
    id: 'DONE' as const,
    title: 'Done'
  }
] satisfies Column[];

export type ColumnId = (typeof DEFAULT_COLUMNS)[number]['id'];
