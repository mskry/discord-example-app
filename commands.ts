import { InstallGlobalCommands } from "./utils.ts";
import { 
  APIApplicationCommand, 
  ApplicationCommandType, 
  ApplicationCommandOptionType 
} from "https://deno.land/x/discord_api_types@0.37.101/v10.ts";

// Define commands
const TEST_COMMAND: APIApplicationCommand = {
  name: "test",
  description: "Basic command",
  type: ApplicationCommandType.ChatInput,
};

const ECHO_COMMAND: APIApplicationCommand = {
  name: "echo",
  description: "Repeats your message",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "The message to repeat",
      required: true,
    },
  ],
};

// Gather all commands
const ALL_COMMANDS: APIApplicationCommand[] = [
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
