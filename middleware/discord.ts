import "jsr:@std/dotenv/load";
import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import type { Context, Next } from "hono";

export const verifyDiscordRequest = createMiddleware(
  async (c: Context, next: Next) => {
    await next();
    console.log(c);
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");

    if (!signature || !timestamp) {
      return c.text("Missing request signature", 401);
    }

    const rawBody = await c.req.text();

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

    await next();
  },
);
