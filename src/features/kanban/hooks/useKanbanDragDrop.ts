'use client';

import { useMemo, useRef, useState } from 'react';
import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  Announcements
} from '@dnd-kit/core';
import { useTaskStore, type Task } from '../utils/store';
import { hasDraggableData } from '../utils';
import { KanbanService } from '../services/kanbanService';
import type { Column } from '../components/board-column';
import type { ColumnId } from '../constants';

export function useKanbanDragDrop() {
  const columns = useTaskStore((state) => state.columns);
  const setColumns = useTaskStore((state) => state.setCols);
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const pickedUpTaskColumn = useRef<ColumnId | 'TODO' | 'IN_PROGRESS' | 'DONE'>(
    'TODO'
  );
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const announcements: Announcements = {
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
        const { tasksInColumn, taskPosition, column } =
          KanbanService.getDraggingTaskData(
            active.id as string,
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
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } =
          KanbanService.getDraggingTaskData(
            over.id as string,
            over.data.current.task.status,
            tasks,
            columns
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
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);
        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } =
          KanbanService.getDraggingTaskData(
            over.id as string,
            over.data.current.task.status,
            tasks,
            columns
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
  };

  const handleDragStart = (event: DragStartEvent) => {
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const moveResult = KanbanService.validateColumnMove(
      activeId,
      overId,
      columns
    );
    if (moveResult) {
      const newColumns = KanbanService.moveColumn(
        columns,
        moveResult.activeIndex,
        moveResult.overIndex
      );
      setColumns(newColumns);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const moveResult = KanbanService.validateTaskMove(
        activeId,
        overId,
        tasks
      );
      if (moveResult) {
        const { activeIndex, overIndex, activeTask, overTask } = moveResult;

        if (activeTask.status !== overTask.status) {
          const newTasks = KanbanService.moveTaskToColumn(
            tasks,
            activeId,
            overTask.status as ColumnId,
            overIndex - 1
          );
          setTasks(newTasks);
        } else {
          const newTasks = KanbanService.moveTaskInSameColumn(
            tasks,
            activeIndex,
            overIndex
          );
          setTasks(newTasks);
        }
      }
      return;
    }

    const isOverAColumn = overData?.type === 'Column';

    // Dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const newTasks = KanbanService.moveTaskToColumn(
        tasks,
        activeId,
        overId as ColumnId
      );
      setTasks(newTasks);
    }
  };

  return {
    sensors,
    announcements,
    activeColumn,
    activeTask,
    columnsId,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  };
}
