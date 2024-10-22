import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import type { Context, Next } from "hono";
import { APIInteraction } from "https://deno.land/x/discord_api_types/v10.ts";

export const verifyDiscordRequest = (clientPublicKey: string) =>
  createMiddleware(async (c: Context, next: Next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");

    if (!signature || !timestamp) {
      return c.text("Missing request signature", 401);
    }

    const rawBody = await c.req.raw.text();

    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      clientPublicKey,
    );

    if (!isValidRequest) {
      return c.text("Bad request signature", 401);
    }

    // Parse the JSON body and set it in the context
    c.set("parsedBody", JSON.parse(rawBody) as APIInteraction);
    const response = await next();
    return response;
  });
