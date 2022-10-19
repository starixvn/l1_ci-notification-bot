import { getPipelineKeyboard, getPipelineMessage } from "../renders/index.js";
import { addMessages, getMessages, pipelineQueue } from "../storages/index.js";

export const PIPELINE_HOOK_EVENT = "Pipeline Hook";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export async function sendMessageToTelegram(bot, pipeline) {
  const id = pipeline.object_attributes.id;
  const messages = getMessages(id);
  const keyboard = getPipelineKeyboard(pipeline);
  const { message, format } = getPipelineMessage(pipeline);
  const extra = { ...keyboard, ...format };

  if (!messages) {
    const conversations = process.env.CONVERSATION_IDS.split(",");
    const sentMessages = await Promise.all(
      conversations.map((id) => bot.telegram.sendMessage(id, message, extra))
    );
    const transformedMessages = sentMessages.map((message) => ({
      messageId: message.message_id,
      chatId: message.chat.id,
    }));

    addMessages(id, transformedMessages);
  } else {
    for (const sentMessage of messages) {
      await bot.telegram.editMessageText(
        sentMessage.chatId,
        sentMessage.messageId,
        null,
        message,
        extra
      );
    }
  }
}

function createCron(bot) {
  let processing = false;

  setInterval(() => {
    if (processing || pipelineQueue.isEmpty()) {
      return;
    }

    processing = true;
    const pipeline = pipelineQueue.dequeue();

    sendMessageToTelegram(bot, pipeline)
      .catch((error) => console.error(error))
      .finally(() => {
        processing = false;
      });
  }, 100);
}

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createPipelineHookHandler(bot) {
  createCron(bot);

  return async (pipeline) => {
    if (
      pipeline?.builds?.length === 0 ||
      pipeline.object_attributes.source === "parent_pipeline"
    ) {
      return;
    }

    pipelineQueue.enqueue(pipeline);
  };
}
