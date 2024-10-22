import { Hono } from "jsr:@hono/hono@4.6.5";
import "jsr:@std/dotenv/load";

import { APIUser } from "https://deno.land/x/discord_api_types/v10.ts";
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
} from "discord-interactions";
import { verifyDiscordRequest } from "./middleware/discord.ts";

const app = new Hono();
const PUBLIC_KEY = Deno.env.get("PUBLIC_KEY");

if (!PUBLIC_KEY) {
  console.error("Missing PUBLIC_KEY environment variable");
  Deno.exit(1);
}

app.use("/interactions/*", verifyDiscordRequest(PUBLIC_KEY));

app.post("/interactions", async (c) => {
  const message = c.get("parsedBody");
  console.log("Interactions message:", message);

  if (message.type === InteractionType.PING) {
    return c.json({ type: InteractionResponseType.PONG });
  }

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
