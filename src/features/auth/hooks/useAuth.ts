'use client';

import { useUser, SignOutButton as ClerkSignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  fullName: string | null;
  email: string;
  imageUrl: string | null;
}

export interface AuthActions {
  signOut: (redirectUrl?: string) => void;
  navigateToProfile: () => void;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  actions: AuthActions;
  SignOutButton: typeof ClerkSignOutButton;
}

export function useAuth(): UseAuthReturn {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();

  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        fullName: clerkUser.fullName,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        imageUrl: clerkUser.imageUrl
      }
    : null;

  const actions: AuthActions = {
    signOut: (redirectUrl = '/auth/sign-in') => {
      // The actual sign out is handled by ClerkSignOutButton component
      // This is a placeholder for any additional sign out logic
    },
    navigateToProfile: () => {
      router.push('/dashboard/profile');
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isLoaded,
    actions,
    SignOutButton: ClerkSignOutButton
  };
}