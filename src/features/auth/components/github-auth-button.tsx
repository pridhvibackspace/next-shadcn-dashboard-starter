'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGithubSignIn = () => {
    setError(null);

    startTransition(async () => {
      try {
        console.log('Attempting to sign in with GitHub');

        // Simulate OAuth flow delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate potential OAuth errors
        if (Math.random() > 0.85) {
          throw new Error('GitHub authentication failed. Please try again.');
        }

        // Simulate OAuth denial
        if (Math.random() > 0.9) {
          throw new Error(
            'GitHub authorization was denied. Please grant access to continue.'
          );
        }

        toast.success('Successfully signed in with GitHub!');

        // Redirect logic would go here
        if (callbackUrl) {
          console.log('Redirecting to:', callbackUrl);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred during GitHub sign-in';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className='w-full'>
      {error && (
        <div className='bg-destructive/15 text-destructive mb-3 rounded-md p-3 text-sm'>
          {error}
        </div>
      )}
      <Button
        className='w-full'
        variant='outline'
        type='button'
        disabled={isPending}
        onClick={handleGithubSignIn}
      >
        {isPending ? (
          <>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
            Connecting...
          </>
        ) : (
          <>
            <Icons.github className='mr-2 h-4 w-4' />
            Continue with Github
          </>
        )}
      </Button>
    </div>
  );
}
