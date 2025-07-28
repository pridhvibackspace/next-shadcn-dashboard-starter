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
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';

/** Zod schema for validating user authentication form data */
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

/** Type definition inferred from the form schema */
type UserFormValue = z.infer<typeof formSchema>;

/**
 * User authentication form component with email and GitHub sign-in options
 * 
 * This component renders a form that allows users to sign in using their email
 * address or through GitHub OAuth. It includes form validation using Zod schema
 * and handles loading states during authentication attempts.
 * 
 * Features:
 * - Email validation with error messages
 * - GitHub OAuth integration
 * - Loading states and transitions
 * - Toast notifications for user feedback
 * - Callback URL handling for redirects
 * 
 * @returns A form component with email input and authentication options
 * 
 * @example
 * ```tsx
 * <UserAuthForm />
 * ```
 */
export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: 'demo@gmail.com'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  /**
   * Handles form submission for email authentication
   * 
   * @param data - Form data containing the validated email address
   */
  const onSubmit = async (data: UserFormValue) => {
    startTransition(() => {
      console.log('continue with email clicked');
      toast.success('Signed In Successfully!');
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
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
