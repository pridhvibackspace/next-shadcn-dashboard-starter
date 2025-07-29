'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function KanbanBoardSkeleton() {
  return (
    <div className='flex gap-4 overflow-x-auto pb-4'>
      {/* Simulate 3 columns */}
      {Array.from({ length: 3 }).map((_, columnIndex) => (
        <div key={columnIndex} className='w-[300px] flex-shrink-0'>
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-5 w-20' />
                <Skeleton className='h-6 w-6 rounded-full' />
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              {/* Simulate tasks in each column */}
              {Array.from({ length: columnIndex + 1 }).map((_, taskIndex) => (
                <Card key={taskIndex} className='p-3'>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-3 w-3/4' />
                    <div className='flex items-center justify-between'>
                      <Skeleton className='h-3 w-16' />
                      <Skeleton className='h-6 w-6 rounded-full' />
                    </div>
                  </div>
                </Card>
              ))}
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        </div>
      ))}
      {/* New section placeholder */}
      <div className='w-[300px] flex-shrink-0'>
        <Skeleton className='h-20 w-full' />
      </div>
    </div>
  );
}
