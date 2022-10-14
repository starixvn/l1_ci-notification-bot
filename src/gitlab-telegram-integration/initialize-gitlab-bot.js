import { createPipelineHookHandler, PIPELINE_HOOK_EVENT } from "./handlers";

/**
 * @param {import("../gitlab-webhook").Webhook} webhook
 * @param {import("telegraf").Telegraf} bot
 * @returns
 */
export function initializeGitlabBot(webhook, bot) {
  webhook.on(PIPELINE_HOOK_EVENT, createPipelineHookHandler(bot));
}
