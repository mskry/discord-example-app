import "jsr:@std/dotenv/load";
import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import type { Context, Next } from "hono";

export const verifyDiscordRequest = createMiddleware(
  async (c: Context, next: Next) => {
    const signature = c.req.raw.headers.get("X-Signature-Ed25519");
    const timestamp = c.req.raw.headers.get("X-Signature-Timestamp");

    if (!signature || !timestamp) {
      return c.text("Missing request signature", 401);
    }

    const rawBody = await c.req.raw.text();

    const publicKey = Deno.env.get("PUBLIC_KEY");
    if (!publicKey) {
      console.error("Missing PUBLIC_KEY environment variable");
      return c.text("Internal server error", 500);
    }

    try {
      const isValidRequest = verifyKey(
        rawBody,
        signature,
        timestamp,
        publicKey,
      );
      if (!isValidRequest) {
        return c.text("Invalid request signature", 401);
      }
    } catch (error) {
      console.error("Error verifying request:", error);
      return c.text("Error verifying request", 401);
    }

    // Parse the body and attach it to the context
    c.set('parsedBody', JSON.parse(rawBody));

    // Ensure we call next() and return its result
    return next();
  },
);
