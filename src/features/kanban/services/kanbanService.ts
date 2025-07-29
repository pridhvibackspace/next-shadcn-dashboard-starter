import { arrayMove } from '@dnd-kit/sortable';
import type { Task } from '../utils/store';
import type { Column } from '../components/board-column';
import type { ColumnId } from '../constants';

export class KanbanService {
  static getDraggingTaskData(
    taskId: string,
    columnId: ColumnId,
    tasks: Task[],
    columns: Column[]
  ) {
    const tasksInColumn = tasks.filter((task) => task.status === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);

    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }

  static moveColumn(
    columns: Column[],
    activeIndex: number,
    overIndex: number
  ): Column[] {
    return arrayMove(columns, activeIndex, overIndex);
  }

  static moveTaskInSameColumn(
    tasks: Task[],
    activeIndex: number,
    overIndex: number
  ): Task[] {
    return arrayMove(tasks, activeIndex, overIndex);
  }

  static moveTaskToColumn(
    tasks: Task[],
    taskId: string,
    newColumnId: ColumnId,
    targetIndex?: number
  ): Task[] {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    const task = tasks[taskIndex];

    if (!task) return tasks;

    const updatedTask = { ...task, status: newColumnId };
    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;

    if (targetIndex !== undefined && targetIndex !== taskIndex) {
      return arrayMove(newTasks, taskIndex, targetIndex);
    }

    return newTasks;
  }

  static validateColumnMove(
    activeId: string,
    overId: string,
    columns: Column[]
  ): { activeIndex: number; overIndex: number } | null {
    const activeIndex = columns.findIndex((col) => col.id === activeId);
    const overIndex = columns.findIndex((col) => col.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return null;
    }

    return { activeIndex, overIndex };
  }

  static validateTaskMove(
    activeId: string,
    overId: string,
    tasks: Task[]
  ): {
    activeIndex: number;
    overIndex: number;
    activeTask: Task;
    overTask: Task;
  } | null {
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);
    const activeTask = tasks[activeIndex];
    const overTask = tasks[overIndex];

    if (!activeTask || !overTask || activeIndex === overIndex) {
      return null;
    }

    return { activeIndex, overIndex, activeTask, overTask };
  }
}
