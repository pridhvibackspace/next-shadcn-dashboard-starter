'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaultValues = {
    email: 'demo@gmail.com'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setError(null);

    startTransition(async () => {
      try {
        console.log('Attempting to sign in with email:', data.email);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate authentication errors
        if (data.email.includes('blocked')) {
          throw new Error(
            'Account has been temporarily blocked. Please contact support.'
          );
        }

        if (data.email.includes('invalid')) {
          throw new Error('Invalid email address or account not found.');
        }

        // Simulate random errors
        if (Math.random() > 0.8) {
          throw new Error(
            'Authentication service is temporarily unavailable. Please try again.'
          );
        }

        toast.success('Sign-in link sent to your email!');

        // Redirect logic would go here if needed
        if (callbackUrl) {
          console.log('Redirecting to:', callbackUrl);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred during sign-in';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          {error && (
            <div className='bg-destructive/15 text-destructive mb-4 rounded-md p-3 text-sm'>
              {error}
            </div>
          )}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className='mt-2 ml-auto w-full'
            type='submit'
          >
            Continue With Email
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  );
}
