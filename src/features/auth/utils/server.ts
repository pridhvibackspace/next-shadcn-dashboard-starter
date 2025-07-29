import { auth } from '@clerk/nextjs/server';

// Server-side authentication function
export async function getServerAuth(): Promise<{ userId: string | null }> {
  const { userId } = auth();
  return { userId };
}
