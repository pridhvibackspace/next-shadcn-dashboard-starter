'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BarGraphSkeleton() {
  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='flex'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
            >
              <Skeleton className='h-3 w-12' />
              <Skeleton className='h-6 w-16 sm:h-8' />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='aspect-auto h-[250px] w-full'>
          {/* Simulate bar chart skeleton */}
          <div className='flex h-full items-end justify-around gap-1 px-4'>
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={index}
                className='w-2 max-w-[20px] flex-1'
                style={{
                  height: `${Math.random() * 80 + 20}%`
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
