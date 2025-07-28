import { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task } from '../utils/store';
import { Column } from '../components/board-column';
import { ColumnId } from '../constants';

export interface DraggingTaskData {
  tasksInColumn: Task[];
  taskPosition: number;
  column: Column | undefined;
}

export class KanbanService {
  static getDraggingTaskData(
    taskId: UniqueIdentifier,
    columnId: ColumnId,
    tasks: Task[],
    columns: Column[]
  ): DraggingTaskData {
    const tasksInColumn = tasks.filter((task) => task.status === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    
    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }

  static moveColumnPosition(
    columns: Column[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ): Column[] {
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);
    
    return arrayMove(columns, activeColumnIndex, overColumnIndex);
  }

  static moveTaskBetweenTasks(
    tasks: Task[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ): Task[] {
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);
    const activeTask = tasks[activeIndex];
    const overTask = tasks[overIndex];

    if (!activeTask || !overTask) return tasks;

    // If moving between different columns, update status
    if (activeTask.status !== overTask.status) {
      activeTask.status = overTask.status;
      return arrayMove(tasks, activeIndex, overIndex - 1);
    }

    return arrayMove(tasks, activeIndex, overIndex);
  }

  static moveTaskToColumn(
    tasks: Task[],
    taskId: UniqueIdentifier,
    columnId: ColumnId
  ): Task[] {
    const activeIndex = tasks.findIndex((t) => t.id === taskId);
    const activeTask = tasks[activeIndex];

    if (!activeTask) return tasks;

    activeTask.status = columnId;
    return arrayMove(tasks, activeIndex, activeIndex);
  }

  static validateTaskMove(
    activeData: any,
    overData: any
  ): { isActiveTask: boolean; isOverTask: boolean; isOverColumn: boolean } {
    return {
      isActiveTask: activeData?.type === 'Task',
      isOverTask: overData?.type === 'Task',
      isOverColumn: overData?.type === 'Column'
    };
  }
}