import {
  createJobHookHandler,
  createPipelineHookHandler,
  JOB_HOOK_EVENT,
  PIPELINE_HOOK_EVENT,
} from "./handlers";

/**
 * @param {import("../gitlab-webhook").Webhook} webhook
 * @param {import("telegraf").Telegraf} bot
 * @returns
 */
export function initializeGitlabBot(webhook, bot) {
  webhook.on(JOB_HOOK_EVENT, createJobHookHandler(bot));
  webhook.on(PIPELINE_HOOK_EVENT, createPipelineHookHandler(bot));
}
