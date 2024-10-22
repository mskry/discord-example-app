import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import type { Context, Next } from "hono";

/**
 * Creates a middleware function for verifying Discord requests.
 *
 * @param clientPublicKey - The public key from the Discord developer dashboard
 * @returns The middleware function
 */
export const verifyDiscordRequest = (clientPublicKey: string) => createMiddleware(
  async (c: Context, next: Next) => {
    const signature = c.req.raw.headers.get("X-Signature-Ed25519");
    const timestamp = c.req.raw.headers.get("X-Signature-Timestamp");

    if (!signature || !timestamp) {
      return c.text("Missing request signature", 401);
    }

    const rawBody = await c.req.raw.text();

    try {
      const isValidRequest = verifyKey(
        rawBody,
        signature,
        timestamp,
        clientPublicKey,
      );
      if (!isValidRequest) {
        return c.text("Invalid request signature", 401);
      }
    } catch (error) {
      console.error("Error verifying request:", error);
      return c.text("Error verifying request", 401);
    }

    // Parse the body and attach it to the context
    c.set("parsedBody", JSON.parse(rawBody));
    console.log(JSON.parse(rawBody));

    // Ensure we call next() and return its result
    return next();
  },
);
