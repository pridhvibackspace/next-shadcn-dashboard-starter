import { UserProfile } from '@/features/auth/hooks/useAuth';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4'>
      <UserProfile />
    </div>
  );
}
