import { Telegraf } from "telegraf";
import { info } from "./commands";

export function createBot() {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  bot.command("start", info);

  return bot;
}
