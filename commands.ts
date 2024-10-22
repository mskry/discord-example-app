import "jsr:@std/dotenv/load";
import { InstallGlobalCommands } from "./utils.ts";
import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
} from "https://deno.land/x/discord_api_types@0.37.101/v10.ts";

// Define commands
const TEST_COMMAND: Partial<APIApplicationCommand> = {
  name: "test",
  description: "Basic command",
  type: ApplicationCommandType.ChatInput,
  dm_permission: true,
  default_member_permissions: null,
  nsfw: false,
  integration_types: [ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
};

const ECHO_COMMAND: Partial<APIApplicationCommand> = {
  name: "echo",
  description: "Repeats your message",
  type: ApplicationCommandType.ChatInput,
  dm_permission: true,
  default_member_permissions: null,
  nsfw: false,
  integration_types: [ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "The message to repeat",
      required: true,
    },
  ],
};

const ALL_COMMANDS: Partial<APIApplicationCommand>[] = [
  TEST_COMMAND,
  ECHO_COMMAND,
];

// Install commands
const APP_ID = Deno.env.get("APP_ID");
if (!APP_ID) {
  console.error("Missing APP_ID environment variable");
  Deno.exit(1);
}

await InstallGlobalCommands(APP_ID, ALL_COMMANDS);
