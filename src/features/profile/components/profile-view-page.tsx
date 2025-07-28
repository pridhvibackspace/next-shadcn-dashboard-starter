import { UserProfile } from '@clerk/nextjs';

/**
 * Profile view page component using Clerk's UserProfile component
 * 
 * This component provides a complete user profile management interface with:
 * - User profile viewing and editing capabilities
 * - Integration with Clerk authentication system
 * - Pre-built UI components for profile management
 * - Responsive design with proper spacing
 * - Full-width layout for optimal user experience
 * 
 * The component leverages Clerk's built-in UserProfile component
 * which handles all profile-related functionality including:
 * - Profile information display and editing
 * - Password management
 * - Email management
 * - Security settings
 * 
 * @returns A complete profile management interface
 * 
 * @example
 * ```tsx
 * // Used in a Next.js page or route
 * export default function ProfilePage() {
 *   return <ProfileViewPage />;
 * }
 * ```
 */
export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4'>
      <UserProfile />
    </div>
  );
}
