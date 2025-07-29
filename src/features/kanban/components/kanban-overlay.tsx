'use client';

import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { Task } from '../utils/store';
import { BoardColumn } from './board-column';
import { TaskCard } from './task-card';
import type { Column } from './board-column';

interface KanbanOverlayProps {
  activeColumn: Column | null;
  activeTask: Task | null;
  tasks: Task[];
}

export function KanbanOverlay({
  activeColumn,
  activeTask,
  tasks
}: KanbanOverlayProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <DragOverlay>
      {activeColumn && (
        <BoardColumn
          isOverlay
          column={activeColumn}
          tasks={tasks.filter((task) => task.status === activeColumn.id)}
        />
      )}
      {activeTask && <TaskCard task={activeTask} isOverlay />}
    </DragOverlay>,
    document.body
  );
}
