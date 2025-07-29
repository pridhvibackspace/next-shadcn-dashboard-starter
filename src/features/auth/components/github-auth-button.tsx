'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

/**
 * GitHub sign-in button component for OAuth authentication
 * 
 * Features:
 * - GitHub-branded button with icon
 * - Callback URL handling from search parameters
 * - Outline button styling for secondary action appearance
 * - Full-width layout to match other authentication form elements
 * 
 * @returns JSX element representing a GitHub sign-in button
 * 
 * @example
 * ```tsx
 * <GithubSignInButton />
 * ```
 * 
 * @remarks
 * This component currently logs the authentication attempt to console.
 * In a production environment, this should trigger the actual GitHub OAuth flow.
 */
export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={() => console.log('continue with github clicked')}
    >
      <Icons.github className='mr-2 h-4 w-4' />
      Continue with Github
    </Button>
  );
}
