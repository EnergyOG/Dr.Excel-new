import { verifyWebhook } from "@clerk/express/webhooks";
import {
  cacheUser,
  upsertUserFromClerk,
  softDeleteUserByClerkId,
} from "../services/userSync.service.js";
import clerkClient from "../config/clerk.js";
import logger from "../utils/logger.js";

/**
 * POST /api/webhooks/clerk
 *
 * IMPORTANT: this route must be mounted with `express.raw({ type: "application/json" })`
 * BEFORE your global `express.json()` body parser, otherwise signature
 * verification will fail (Svix needs the raw request body). See server.js —
 * webhook routes are mounted before the json/urlencoded parsers are applied.
 */
export const handleClerkWebhook = async (req, res) => {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    logger.error(`Clerk webhook verification failed: ${err.message}`);
    return res.status(400).json({ success: false, error: "Invalid webhook signature" });
  }

  const { type: eventType, data } = evt;

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        await upsertUserFromClerk(data);
        logger.info(`Clerk webhook ${eventType} synced - clerkId: ${data.id}`);
        break;
      }
      case "user.deleted": {
        // Clerk sends { id, deleted: true } for hard deletes from the dashboard
        await softDeleteUserByClerkId(data.id);
        break;
      }
      case "session.created": {
        if (data.user_id) {
          const clerkUser = await clerkClient.users.getUser(data.user_id);
          const user = await upsertUserFromClerk(clerkUser);
          user.lastLogin = new Date();
          await user.save();
          await cacheUser(user);
          logger.info(`Clerk webhook session.created synced - clerkId: ${data.user_id}`);
        }
        break;
      }
      default:
        logger.info(`Unhandled Clerk webhook event: ${eventType}`);
    }

    // Always ack quickly - Clerk/Svix retries on non-2xx responses.
    return res.status(200).json({ success: true });
  } catch (err) {
    logger.error(`Error processing Clerk webhook (${eventType}): ${err.message}`);
    // Returning 500 lets Svix retry the delivery later.
    return res.status(500).json({ success: false, error: "Webhook processing failed" });
  }
};
