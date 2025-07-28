'use client';

import { useRef } from 'react';
import { 
  DragStartEvent, 
  DragEndEvent, 
  DragOverEvent, 
  UniqueIdentifier,
  Announcements 
} from '@dnd-kit/core';
import { hasDraggableData } from '../utils';
import { Task, useTaskStore } from '../utils/store';
import { Column } from '../components/board-column';
import { ColumnId } from '../constants';
import { KanbanService } from '../services/kanbanService';

export interface UseKanbanDragDropProps {
  columns: Column[];
  tasks: Task[];
  setColumns: (columns: Column[]) => void;
  setTasks: (tasks: Task[]) => void;
  setActiveColumn: (column: Column | null) => void;
  setActiveTask: (task: Task | null) => void;
}

export function useKanbanDragDrop({
  columns,
  tasks,
  setColumns,
  setTasks,
  setActiveColumn,
  setActiveTask
}: UseKanbanDragDropProps) {
  const pickedUpTaskColumn = useRef<ColumnId>('TODO');
  const columnsId = columns.map((col) => col.id);

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } 
      
      if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task.status;
        const { tasksInColumn, taskPosition, column } = KanbanService.getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current,
          tasks,
          columns
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
      } 
      
      if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = KanbanService.getDraggingTaskData(
          over.id,
          over.data.current.task.status,
          tasks,
          columns
        );
        return `Task ${active.data.current.task.title} was moved over task ${
          over.data.current.task.title
        } at position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },

    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;
      
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was dropped into position ${
          overColumnIdx + 1
        } of ${columnsId.length}`;
      }
      
      if (active.data.current?.type === 'Task') {
        const { column } = KanbanService.getDraggingTaskData(
          over.id,
          over.data.current?.task?.status || active.data.current.task.status,
          tasks,
          columns
        );
        return `Task was dropped into column ${column?.title}`;
      }
    },

    onDragCancel({ active }) {
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const updatedColumns = KanbanService.moveColumnPosition(columns, activeId, overId);
    setColumns(updatedColumns);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const { isActiveTask, isOverTask, isOverColumn } = KanbanService.validateTaskMove(
      activeData,
      overData
    );

    if (!isActiveTask) return;

    // Moving a Task over another Task
    if (isActiveTask && isOverTask) {
      const updatedTasks = KanbanService.moveTaskBetweenTasks(tasks, activeId, overId);
      setTasks(updatedTasks);
    }

    // Moving a Task over a column
    if (isActiveTask && isOverColumn) {
      const updatedTasks = KanbanService.moveTaskToColumn(tasks, activeId, overId as ColumnId);
      setTasks(updatedTasks);
    }
  }

  return {
    announcements,
    onDragStart,
    onDragEnd,
    onDragOver
  };
}