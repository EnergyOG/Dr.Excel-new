import User from "../model/user.model.js";
import logger from "../utils/logger.js";

/**
 * Normalizes a Clerk user object (same shape whether it comes from a
 * webhook payload `evt.data` or from clerkClient.users.getUser()) into
 * the fields we store in MongoDB.
 */
function mapClerkUserToDoc(clerkUser) {
  const primaryEmail = clerkUser.email_addresses?.find(
    (e) => e.id === clerkUser.primary_email_address_id
  );

  const externalAccounts = (clerkUser.external_accounts || []).map((acc) => ({
    provider: acc.provider, // e.g. "oauth_google", "oauth_facebook", "oauth_x"
    providerUserId: acc.provider_user_id || acc.id,
    emailAddress: acc.email_address,
  }));

  return {
    authProvider: "clerk",
    clerkId: clerkUser.id,
    email:
      primaryEmail?.email_address || clerkUser.email_addresses?.[0]?.email_address,
    username: clerkUser.username || undefined,
    firstName: clerkUser.first_name || undefined,
    lastName: clerkUser.last_name || undefined,
    imageUrl: clerkUser.image_url,
    isEmailVerified: primaryEmail?.verification?.status === "verified" || false,
    externalAccounts,
  };
}

/**
 * Upsert a user document from a Clerk payload. Used by both the
 * `user.created` / `user.updated` webhook handlers and by the
 * on-demand sync fallback (see middleware/auth.middleware.js).
 */
export async function upsertUserFromClerk(clerkUser) {
  const doc = mapClerkUserToDoc(clerkUser);

  if (!doc.email) {
    throw new Error(`Clerk user ${clerkUser.id} has no email address to sync`);
  }

  const user = await User.findOneAndUpdate(
    { clerkId: doc.clerkId },
    { $set: doc },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  return user;
}

export async function softDeleteUserByClerkId(clerkId) {
  const user = await User.findOneAndUpdate(
    { clerkId },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true }
  );

  if (user) {
    logger.info(`SOFT_DELETE_USER (via Clerk webhook) - clerkId: ${clerkId}`);
  }

  return user;
}

export { mapClerkUserToDoc };
