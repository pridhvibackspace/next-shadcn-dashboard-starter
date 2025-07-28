'use client';

import { UserProfile } from '@clerk/nextjs';

export function AuthProfileView() {
  return (
    <div className='flex w-full flex-col p-4'>
      <UserProfile />
    </div>
  );
}