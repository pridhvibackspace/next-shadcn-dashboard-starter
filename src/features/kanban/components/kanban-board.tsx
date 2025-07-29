'use client';
import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTaskStore } from '../utils/store';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { TaskCard } from './task-card';
import { useKanbanDragDrop } from '../hooks/useKanbanDragDrop';
import { DEFAULT_COLUMNS, type ColumnId } from '../constants';

export function KanbanBoard() {
  const columns = useTaskStore((state) => state.columns);
  const tasks = useTaskStore((state) => state.tasks);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const {
    sensors,
    announcements,
    activeColumn,
    activeTask,
    columnsId,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  } = useKanbanDragDrop();

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);

  if (!isMounted) return;

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col, index) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                tasks={tasks.filter((task) => task.status === col.id)}
              />
              {index === columns?.length - 1 && (
                <div className='w-[300px]'>
                  <NewSectionDialog />
                </div>
              )}
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
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
        )}
    </DndContext>
  );
}

export { DEFAULT_COLUMNS, type ColumnId };
