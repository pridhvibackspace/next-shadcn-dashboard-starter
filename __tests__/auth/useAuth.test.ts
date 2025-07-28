import { renderHook } from '@testing-library/react';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  SignOutButton: jest.fn()
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

describe('useAuth hook', () => {
  it('should return null user when not authenticated', () => {
    const { useUser } = require('@clerk/nextjs');
    useUser.mockReturnValue({ user: null, isLoaded: true });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return user data when authenticated', () => {
    const { useUser } = require('@clerk/nextjs');
    const mockUser = {
      id: '123',
      fullName: 'John Doe',
      imageUrl: 'https://example.com/avatar.jpg',
      emailAddresses: [{ emailAddress: 'john@example.com' }]
    };
    
    useUser.mockReturnValue({ user: mockUser, isLoaded: true });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      id: '123',
      fullName: 'John Doe',
      email: 'john@example.com',
      imageUrl: 'https://example.com/avatar.jpg'
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});