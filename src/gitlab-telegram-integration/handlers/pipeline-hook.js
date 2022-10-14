import { Markup } from "telegraf";

export const PIPELINE_HOOK_EVENT = "Pipeline Hook";

const statuses = {
  failed: "❌",
  warning: "⚠️",
  pending: "⏸️",
  running: "🟢",
  manual: "⚙️",
  scheduled: "🔄",
  canceled: "✖️",
  success: "✅",
  skipped: "⚫",
  created: "⚪",
};

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createPipelineHookHandler(bot) {
  const conversations = process.env.CONVERSATION_IDS.split(",");

  return (data) => {
    const keyboards = data.builds.map((build) => {
      const { name, status } = build;

      return Markup.button.url(
        `${statuses[status]} ${name}`,
        "https://google.com"
      );
    });

    conversations.forEach((id) => {
      bot.telegram.sendMessage(
        id,
        data.object_attributes.ref,
        Markup.inlineKeyboard(keyboards, { columns: 2 })
      );
    });
  };
}
