import { APIApplicationCommand } from "https://deno.land/x/discord_api_types@0.37.101/v10.ts";
import { RequestInit } from "https://deno.land/std@0.192.0/http/mod.ts";
import "@std/dotenv/load";

interface DiscordRequestOptions extends Omit<RequestInit, 'body'> {
  body?: RequestInit['body'] | APIApplicationCommand[];
}

export async function DiscordRequest(
  endpoint: string,
  options: DiscordRequestOptions,
): Promise<Response> {
  const DISCORD_API_URL = Deno.env.get("DISCORD_API_URL");
  const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");

  if (!DISCORD_API_URL || !DISCORD_TOKEN) {
    throw new Error(
      "Missing DISCORD_API_URL or DISCORD_TOKEN environment variable",
    );
  }

  const url = DISCORD_API_URL + endpoint;
  const requestOptions: RequestInit = { ...options };

  if (options.body && Array.isArray(options.body)) {
    requestOptions.body = JSON.stringify(options.body);
  } else if (options.body && typeof options.body === 'object') {
    requestOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...requestOptions,
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
  commands: APIApplicationCommand[],
): Promise<void> {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
    console.log("Successfully installed global commands");
  } catch (err) {
    console.error("Error installing global commands:", err);
    throw err;
  }
}
