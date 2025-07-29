'use client';

import { Fragment } from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { Task } from '../utils/store';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import type { Column } from './board-column';

interface KanbanColumnsProps {
  columns: Column[];
  tasks: Task[];
  columnsId: string[];
}

export function KanbanColumns({
  columns,
  tasks,
  columnsId
}: KanbanColumnsProps) {
  return (
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
  );
}
