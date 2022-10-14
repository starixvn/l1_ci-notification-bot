import { getPipelineKeyboard, getPipelineMessage } from "../renders";
import { addMessages, getMessages, pipelineQueue } from "../storages";

export const PIPELINE_HOOK_EVENT = "Pipeline Hook";

export async function sendMessageToTelegram(bot, pipeline) {
  const id = pipeline.object_attributes.id;
  const conversations = process.env.CONVERSATION_IDS.split(",");
  const messages = getMessages(id);
  const keyboard = getPipelineKeyboard(pipeline);
  const message = getPipelineMessage(pipeline);

  if (!messages) {
    const sentMessages = await Promise.all(
      conversations.map((id) => bot.telegram.sendMessage(id, message, keyboard))
    );
    const transformedMessages = sentMessages.map((message) => ({
      message_id: message.message_id,
    }));

    addMessages(id, transformedMessages);
  } else {
    for (const chatId of conversations) {
      for (const sentMessage of messages) {
        await bot.telegram.editMessageText(
          chatId,
          sentMessage.message_id,
          null,
          message,
          keyboard
        );
      }
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
