import { renderHook } from '@testing-library/react';
import { useDragAndDrop } from '../use-drag-and-drop';
import { useTaskStore } from '../../utils/store';

// Mock the store
jest.mock('../../utils/store', () => ({
  useTaskStore: jest.fn()
}));

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;

describe('useDragAndDrop', () => {
  beforeEach(() => {
    mockUseTaskStore.mockImplementation((selector) => {
      const mockState = {
        columns: [
          { id: 'TODO', title: 'Todo' },
          { id: 'IN_PROGRESS', title: 'In Progress' },
          { id: 'DONE', title: 'Done' }
        ],
        tasks: [
          { id: '1', title: 'Task 1', status: 'TODO' },
          { id: '2', title: 'Task 2', status: 'IN_PROGRESS' }
        ],
        setCols: jest.fn(),
        setTasks: jest.fn()
      };
      return selector(mockState);
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDragAndDrop());

    expect(result.current.activeColumn).toBeNull();
    expect(result.current.activeTask).toBeNull();
    expect(result.current.sensors).toBeDefined();
    expect(typeof result.current.onDragStart).toBe('function');
    expect(typeof result.current.onDragEnd).toBe('function');
    expect(typeof result.current.onDragOver).toBe('function');
  });

  it('should provide drag and drop event handlers', () => {
    const { result } = renderHook(() => useDragAndDrop());

    expect(result.current.onDragStart).toBeDefined();
    expect(result.current.onDragEnd).toBeDefined();
    expect(result.current.onDragOver).toBeDefined();
    expect(result.current.getDraggingTaskData).toBeDefined();
  });
});
