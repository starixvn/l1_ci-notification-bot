/**
 * @param {import("../gitlab-webhook").Webhook} webhook
 * @param {import("telegraf").Telegraf} bot
 * @returns
 */
export function initializeGitlabBot(webhook, bot) {
  const conversations = process.env.CONVERSATION_IDS.split(",");

  webhook.on("*", (data) => {
    conversations.forEach((id) => {
      bot.telegram.sendMessage(id, JSON.stringify(data, null, 2));
    });
  });
}
