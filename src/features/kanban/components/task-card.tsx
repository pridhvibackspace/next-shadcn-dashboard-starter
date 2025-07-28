import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from '../utils/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { IconGripVertical } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

/**
 * Props for the TaskCard component
 */
interface TaskCardProps {
  /** The task data to display */
  task: Task;
  /** Whether this card is being used as a drag overlay */
  isOverlay?: boolean;
}

/** Type identifier for drag-and-drop operations */
export type TaskType = 'Task';

/**
 * Drag data interface for task cards during drag-and-drop operations
 */
export interface TaskDragData {
  /** Type identifier for the draggable item */
  type: TaskType;
  /** The task being dragged */
  task: Task;
}

/**
 * Individual task card component with drag-and-drop functionality
 * 
 * This component renders a single task within the kanban board with:
 * - Drag-and-drop support for moving between columns
 * - Visual feedback during drag operations
 * - Accessible drag handle with screen reader support
 * - Card-based layout with task title and metadata
 * - Responsive design with proper spacing
 * 
 * The card integrates with dnd-kit's sortable system and provides
 * visual indicators for different drag states (dragging, overlay).
 * 
 * @param props - Component props
 * @param props.task - The task data to display
 * @param props.isOverlay - Whether this is a drag overlay instance
 * 
 * @returns A draggable task card with proper styling and interactions
 * 
 * @example
 * ```tsx
 * <TaskCard 
 *   task={{ id: '1', title: 'Complete feature', status: 'TODO' }}
 *   isOverlay={false}
 * />
 * ```
 */
export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva('mb-2', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className='space-between border-secondary relative flex flex-row border-b-2 px-3 py-3'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>Move task</span>
          <IconGripVertical />
        </Button>
        <Badge variant={'outline'} className='ml-auto font-semibold'>
          Task
        </Badge>
      </CardHeader>
      <CardContent className='px-3 pt-3 pb-6 text-left whitespace-pre-wrap'>
        {task.title}
      </CardContent>
    </Card>
  );
}
