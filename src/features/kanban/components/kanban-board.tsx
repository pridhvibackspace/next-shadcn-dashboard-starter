'use client';
import { useEffect, useMemo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useTaskStore } from '../utils/store';
import { useDragAndDrop } from '../hooks/use-drag-and-drop';
import { useKanbanAnnouncements } from '../hooks/use-kanban-announcements';
import { KanbanColumns } from './kanban-columns';
import { KanbanOverlay } from './kanban-overlay';
import type { Column } from './board-column';

const defaultCols = [
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

export type ColumnId = (typeof defaultCols)[number]['id'];

export function KanbanBoard() {
  const columns = useTaskStore((state) => state.columns);
  const tasks = useTaskStore((state) => state.tasks);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const {
    sensors,
    activeColumn,
    activeTask,
    onDragStart,
    onDragEnd,
    onDragOver,
    getDraggingTaskData,
    pickedUpTaskColumn
  } = useDragAndDrop();

  const announcements = useKanbanAnnouncements({
    columns,
    tasks,
    getDraggingTaskData,
    pickedUpTaskColumn
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);

  if (!isMounted) return null;

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <KanbanColumns columns={columns} tasks={tasks} columnsId={columnsId} />

      <KanbanOverlay
        activeColumn={activeColumn}
        activeTask={activeTask}
        tasks={tasks}
      />
    </DndContext>
  );
}
