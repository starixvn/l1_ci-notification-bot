/**
 * @param {import("telegraf").Context} context
 */
export function info(context) {
  context.replyWithHTML(`This chat's ID is: <code>${context.chat.id}</code>`);
}
