import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import type { Context, Next } from "hono";

export const verifyDiscordRequest = (clientPublicKey: string) =>
  createMiddleware(async (c: Context, next: Next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const rawBody = await c.req.raw.text();
    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      clientPublicKey,
    );

    console.log(isValidRequest);
    if (!isValidRequest) {
      return c.text("Bad request signature", 401);
    }

    c.set("parsedBody", JSON.parse(rawBody));
    return next();
  });
