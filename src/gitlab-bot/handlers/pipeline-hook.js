export const PIPELINE_HOOK_EVENT = "Pipeline Hook";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createPipelineHookHandler(bot) {
  const conversations = process.env.CONVERSATION_IDS.split(",");

  return (data) => {
    conversations.forEach((id) => {
      bot.telegram.sendMessage(id, JSON.stringify(data, null, 2));
    });
  };
}
