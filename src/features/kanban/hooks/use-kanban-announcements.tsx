'use client';

import { useMemo } from 'react';
import { Announcements, UniqueIdentifier } from '@dnd-kit/core';
import { Task } from '../utils/store';
import { hasDraggableData } from '../utils';
import type { Column } from '../components/board-column';
import type { ColumnId } from '../components/kanban-board';

interface UseKanbanAnnouncementsProps {
  columns: Column[];
  tasks: Task[];
  getDraggingTaskData: (
    taskId: UniqueIdentifier,
    columnId: ColumnId
  ) => {
    tasksInColumn: Task[];
    taskPosition: number;
    column: Column | undefined;
  };
  pickedUpTaskColumn: React.MutableRefObject<
    ColumnId | 'TODO' | 'IN_PROGRESS' | 'DONE'
  >;
}

export function useKanbanAnnouncements({
  columns,
  tasks,
  getDraggingTaskData,
  pickedUpTaskColumn
}: UseKanbanAnnouncementsProps) {
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        if (!hasDraggableData(active)) return;
        if (active.data.current?.type === 'Column') {
          const startColumnIdx = columnsId.findIndex((id) => id === active.id);
          const startColumn = columns[startColumnIdx];
          return `Picked up Column ${startColumn?.title} at position: ${
            startColumnIdx + 1
          } of ${columnsId.length}`;
        } else if (active.data.current?.type === 'Task') {
          pickedUpTaskColumn.current = active.data.current.task.status;
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            active.id,
            pickedUpTaskColumn.current
          );
          return `Picked up Task ${active.data.current.task.title} at position: ${
            taskPosition + 1
          } of ${tasksInColumn.length} in column ${column?.title}`;
        }
      },
      onDragOver({ active, over }) {
        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        if (
          active.data.current?.type === 'Column' &&
          over.data.current?.type === 'Column'
        ) {
          const overColumnIdx = columnsId.findIndex((id) => id === over.id);
          return `Column ${active.data.current.column.title} was moved over ${
            over.data.current.column.title
          } at position ${overColumnIdx + 1} of ${columnsId.length}`;
        } else if (
          active.data.current?.type === 'Task' &&
          over.data.current?.type === 'Task'
        ) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task ${
              active.data.current.task.title
            } was moved over column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was moved over position ${taskPosition + 1} of ${
            tasksInColumn.length
          } in column ${column?.title}`;
        }
      },
      onDragEnd({ active, over }) {
        if (!hasDraggableData(active) || !hasDraggableData(over)) {
          pickedUpTaskColumn.current = 'TODO';
          return;
        }
        if (
          active.data.current?.type === 'Column' &&
          over.data.current?.type === 'Column'
        ) {
          const overColumnPosition = columnsId.findIndex(
            (id) => id === over.id
          );

          return `Column ${
            active.data.current.column.title
          } was dropped into position ${overColumnPosition + 1} of ${
            columnsId.length
          }`;
        } else if (
          active.data.current?.type === 'Task' &&
          over.data.current?.type === 'Task'
        ) {
          const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
            over.id,
            over.data.current.task.status
          );
          if (over.data.current.task.status !== pickedUpTaskColumn.current) {
            return `Task was dropped into column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`;
          }
          return `Task was dropped into position ${taskPosition + 1} of ${
            tasksInColumn.length
          } in column ${column?.title}`;
        }
        pickedUpTaskColumn.current = 'TODO';
      },
      onDragCancel({ active }) {
        pickedUpTaskColumn.current = 'TODO';
        if (!hasDraggableData(active)) return;
        return `Dragging ${active.data.current?.type} cancelled.`;
      }
    }),
    [columns, columnsId, getDraggingTaskData, pickedUpTaskColumn]
  );

  return announcements;
}
