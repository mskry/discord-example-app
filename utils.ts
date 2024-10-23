import "@std/dotenv/load";
import { APIApplicationCommand } from "https://deno.land/x/discord_api_types@0.37.101/v10.ts";

export async function DiscordRequest(
  endpoint: string,
  options: RequestInit,
): Promise<Response> {
  const DISCORD_API_URL = Deno.env.get("DISCORD_API_URL");
  const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");

  if (!DISCORD_API_URL || !DISCORD_TOKEN) {
    throw new Error(
      "Missing DISCORD_API_URL or DISCORD_TOKEN environment variable",
    );
  }

  const url = DISCORD_API_URL + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    console.error(`Discord API Error (${res.status}):`, data);
    throw new Error(`Discord API Error: ${res.status} ${res.statusText}`);
  }

  return res;
}

export async function InstallGlobalCommands(
  appId: string,
  commands: Partial<APIApplicationCommand>[],
): Promise<void> {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(commands),
    });
    console.log("Successfully installed global commands");
  } catch (err) {
    console.error("Error installing global commands:", err);
    throw err;
  }
}
