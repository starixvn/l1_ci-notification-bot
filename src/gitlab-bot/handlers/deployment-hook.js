export const DEPLOYMENT_HOOK_EVENT = "Deployment Hook";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createDeploymentHookHandler(bot) {
  const conversations = process.env.CONVERSATION_IDS.split(",");

  return (data) => {
    conversations.forEach((id) => {
      bot.telegram.sendMessage(id, JSON.stringify(data, null, 2));
    });
  };
}
