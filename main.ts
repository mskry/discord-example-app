import "jsr:@std/dotenv/load";
import { type Context, Hono } from "jsr:@hono/hono@4.6.5";
import {
  InteractionResponseType,
  InteractionType,
} from "https://deno.land/x/discord_api_types@0.37.102/v10.ts";
import { verifyDiscordRequest } from "./middleware/discord.ts";

const app = new Hono();
const PUBLIC_KEY = Deno.env.get("PUBLIC_KEY");

if (!PUBLIC_KEY) {
  console.error("Missing PUBLIC_KEY environment variable");
  Deno.exit(1);
}

app.use("/interactions/*", verifyDiscordRequest(PUBLIC_KEY));

app.post("/interactions", (c: Context) => {
  const { type, data } = c.get("parsedBody");
  if (type === InteractionType.Ping) {
    return c.json({ type: InteractionResponseType.Pong });
  }

  if (type === InteractionType.ApplicationCommand) {
    if (data.name === "echo") {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Echo!",
        },
      });
    }
    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Hello world",
      },
    });
  }

  // Default response for unhandled interaction types
  return c.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Unhandled interaction type",
    },
  });
});

Deno.serve(app.fetch);
