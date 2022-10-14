import { getPipelineKeyboard, getPipelineMessage } from "../renders";
import { addMessages, getMessages, pipelineQueue } from "../storages";

export const PIPELINE_HOOK_EVENT = "Pipeline Hook";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export async function sendMessageToTelegram(bot, pipeline) {
  const id = pipeline.object_attributes.id;
  const messages = getMessages(id);
  const keyboard = getPipelineKeyboard(pipeline);
  const message = getPipelineMessage(pipeline);

  if (!messages) {
    const conversations = process.env.CONVERSATION_IDS.split(",");
    const sentMessages = await Promise.all(
      conversations.map((id) => bot.telegram.sendMessage(id, message, keyboard))
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
        keyboard
      );
    }
  }
}

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createPipelineHookHandler(bot) {
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

  return async (data) => {
    pipelineQueue.enqueue(data);
  };
}
