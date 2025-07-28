import { Task } from '../utils/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconGripVertical } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

/**
 * Interface defining the structure of a kanban board column
 */
export interface Column {
  /** Unique identifier for the column */
  id: UniqueIdentifier;
  /** Display title of the column */
  title: string;
}

/** Type identifier for drag-and-drop operations */
export type ColumnType = 'Column';

/**
 * Drag data interface for columns during drag-and-drop operations
 */
export interface ColumnDragData {
  /** Type identifier for the draggable item */
  type: ColumnType;
  /** The column being dragged */
  column: Column;
}

/**
 * Props for the BoardColumn component
 */
interface BoardColumnProps {
  /** The column data to display */
  column: Column;
  /** Array of tasks belonging to this column */
  tasks: Task[];
  /** Whether this column is being used as a drag overlay */
  isOverlay?: boolean;
}

/**
 * Individual column component for the kanban board
 * 
 * This component renders a single column within the kanban board with:
 * - Drag-and-drop support for column reordering
 * - Scrollable task list with proper overflow handling
 * - Column action menu for editing and deletion
 * - Sortable context for task reordering within the column
 * - Visual feedback during drag operations
 * - Responsive design with fixed width and height
 * 
 * The column integrates with dnd-kit's sortable system and manages
 * both its own drag state and the sortable context for its tasks.
 * 
 * @param props - Component props
 * @param props.column - The column data to display
 * @param props.tasks - Tasks belonging to this column
 * @param props.isOverlay - Whether this is a drag overlay instance
 * 
 * @returns A draggable column with task management capabilities
 * 
 * @example
 * ```tsx
 * <BoardColumn
 *   column={{ id: 'todo', title: 'To Do' }}
 *   tasks={todoTasks}
 *   isOverlay={false}
 * />
 * ```
 */
export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    'h-[75vh] max-h-[75vh] w-[350px] max-w-full bg-secondary flex flex-col shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className='space-between flex flex-row items-center border-b-2 p-4 text-left font-semibold'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-primary/50 relative -ml-2 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>{`Move column: ${column.title}`}</span>
          <IconGripVertical />
        </Button>
        {/* <span className="mr-auto mt-0!"> {column.title}</span> */}
        {/* <Input
          defaultValue={column.title}
          className="text-base mt-0! mr-auto"
        /> */}
        <ColumnActions id={column.id} title={column.title} />
      </CardHeader>
      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
        <ScrollArea className='h-full'>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Container component for the kanban board layout
 * 
 * This component provides the main container for all board columns with:
 * - Horizontal scrolling for overflow columns
 * - Responsive padding and spacing
 * - Dynamic styling based on drag context
 * - Snap scrolling for better UX on mobile
 * - Proper flex layout for column arrangement
 * 
 * The container responds to the drag context to disable snap scrolling
 * during drag operations for smoother interactions.
 * 
 * @param props - Component props
 * @param props.children - The board columns and other content
 * 
 * @returns A scrollable container for the kanban board
 * 
 * @example
 * ```tsx
 * <BoardContainer>
 *   <BoardColumn column={column1} tasks={tasks1} />
 *   <BoardColumn column={column2} tasks={tasks2} />
 * </BoardContainer>
 * ```
 */
export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2  pb-4 md:px-0 flex lg:justify-start', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (
    <ScrollArea className='w-full rounded-md whitespace-nowrap'>
      <div
        className={variations({
          dragging: dndContext.active ? 'active' : 'default'
        })}
      >
        <div className='flex flex-row items-start justify-center gap-4'>
          {children}
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
