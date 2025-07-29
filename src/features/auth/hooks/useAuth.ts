'use client';

import {
  useUser,
  SignOutButton as ClerkSignOutButton,
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  UserProfile as ClerkUserProfile
} from '@clerk/nextjs';

// Authentication user interface to abstract from Clerk-specific types
export interface AuthUser {
  id: string;
  fullName?: string | null;
  email?: string;
  imageUrl?: string;
}

// Authentication context interface
export interface AuthContext {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

// Client-side authentication hook
export function useAuth(): AuthContext {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return {
      user: null,
      isLoaded: false,
      isSignedIn: false
    };
  }

  const authUser: AuthUser | null = user
    ? {
        id: user.id,
        fullName: user.fullName,
        email: user.emailAddresses?.[0]?.emailAddress,
        imageUrl: user.imageUrl
      }
    : null;

  return {
    user: authUser,
    isLoaded,
    isSignedIn: !!isSignedIn
  };
}

// Authentication component abstractions
export const SignOutButton = ClerkSignOutButton;
export const SignInForm = ClerkSignIn;
export const SignUpForm = ClerkSignUp;
export const UserProfile = ClerkUserProfile;

// Export types for use in components
export type { AuthUser, AuthContext };
