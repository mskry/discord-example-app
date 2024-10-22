import { InstallGlobalCommands } from "./utils.ts";
import type { APIUserApplicationCommandInteraction } from "https://deno.land/x/discord_api_types@0.37.101/v10.ts";

const TEST_COMMAND: APIUserApplicationCommandInteraction = {
  name: "test",
  description: "Basic command",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS: Array<APIUserApplicationCommandInteraction> = [
  TEST_COMMAND,
];

InstallGlobalCommands(Deno.env.get("APP_ID"), ALL_COMMANDS);
