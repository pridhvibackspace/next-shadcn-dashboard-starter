import { KanbanService } from '@/features/kanban/services/kanbanService';
import { Task } from '@/features/kanban/utils/store';
import { Column } from '@/features/kanban/components/board-column';

describe('KanbanService', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', status: 'TODO' },
    { id: '2', title: 'Task 2', status: 'TODO' },
    { id: '3', title: 'Task 3', status: 'IN_PROGRESS' }
  ];

  const mockColumns: Column[] = [
    { id: 'TODO', title: 'Todo' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' }
  ];

  describe('getDraggingTaskData', () => {
    it('should return correct task data', () => {
      const result = KanbanService.getDraggingTaskData('1', 'TODO', mockTasks, mockColumns);
      
      expect(result.tasksInColumn).toHaveLength(2);
      expect(result.taskPosition).toBe(0);
      expect(result.column?.title).toBe('Todo');
    });
  });

  describe('moveTaskToColumn', () => {
    it('should update task status when moving to new column', () => {
      const updatedTasks = KanbanService.moveTaskToColumn(mockTasks, '1', 'IN_PROGRESS');
      const movedTask = updatedTasks.find(t => t.id === '1');
      
      expect(movedTask?.status).toBe('IN_PROGRESS');
    });
  });

  describe('validateTaskMove', () => {
    it('should correctly identify task and column types', () => {
      const activeData = { type: 'Task' };
      const overData = { type: 'Column' };
      
      const result = KanbanService.validateTaskMove(activeData, overData);
      
      expect(result.isActiveTask).toBe(true);
      expect(result.isOverTask).toBe(false);
      expect(result.isOverColumn).toBe(true);
    });
  });
});