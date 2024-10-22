import { Hono } from "jsr:@hono/hono@4.6.5";
import type { Context } from "hono";
import "jsr:@std/dotenv/load";

import { APIUser } from "https://deno.land/x/discord_api_types/v10.ts";
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKey,
} from "discord-interactions";
import { verifyDiscordRequest } from "./middleware/discord.ts";

const app = new Hono();
app.post("/interactions/*", verifyDiscordRequest);

app.post("/interactions", async (c) => {
  const message = await c.req.json();
  if (message.type === InteractionType.APPLICATION_COMMAND) {
    return c.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Hello world",
      },
    });
  }
});

Deno.serve(app.fetch);
