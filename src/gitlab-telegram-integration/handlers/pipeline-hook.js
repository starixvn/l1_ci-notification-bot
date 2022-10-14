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

const cached = {};

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createPipelineHookHandler(bot) {
  const conversations = process.env.CONVERSATION_IDS.split(",");

  return async (data) => {
    const keyboards = data.builds.map((build) => {
      const { name, status } = build;

      return Markup.button.url(
        `${statuses[status]} ${name}`,
        "https://google.com"
      );
    });
    const keyboard = Markup.inlineKeyboard(keyboards, { columns: 2 });

    if (cached[data.object_attributes.id]) {
      cached[data.object_attributes.id].data = data;
      const messages = cached[data.object_attributes.id].messages;

      conversations.forEach((id) => {
        messages.forEach((message) => {
          bot.telegram.editMessageText(
            id,
            message.message_id,
            null,
            data.object_attributes.ref,
            keyboard
          );
        });
      });
    } else {
      const messages = await Promise.all(
        conversations.map((id) =>
          bot.telegram.sendMessage(
            id,
            data.object_attributes.ref,
            Markup.inlineKeyboard(keyboards, { columns: 2 })
          )
        )
      );

      cached[data.object_attributes.id] = {
        messages: messages,
        data: data,
      };
    }
  };
}
