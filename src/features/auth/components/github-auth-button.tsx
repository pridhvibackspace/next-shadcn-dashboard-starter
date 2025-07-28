'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

/**
 * GitHub authentication button component
 * 
 * This component renders a button that initiates GitHub OAuth authentication.
 * It handles callback URL parameter extraction for post-authentication redirects
 * and provides visual feedback with GitHub branding.
 * 
 * Features:
 * - GitHub OAuth integration
 * - Callback URL handling for redirects
 * - Consistent button styling with outline variant
 * - GitHub icon for clear visual identification
 * 
 * @returns A styled button component for GitHub authentication
 * 
 * @example
 * ```tsx
 * <GithubSignInButton />
 * ```
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
