import { createClerkClient } from "@clerk/express";

// Central Clerk client instance - used anywhere you need to call the Clerk API
// directly (e.g. fetching a user by id as a fallback to webhooks, or revoking
// sessions when an admin suspends someone).
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export default clerkClient;
