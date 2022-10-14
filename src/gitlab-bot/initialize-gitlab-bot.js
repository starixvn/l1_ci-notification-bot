import { createPipelineHookHandler, PIPELINE_HOOK_EVENT } from "./handlers";
import {
  createDeploymentHookHandler,
  DEPLOYMENT_HOOK_EVENT,
} from "./handlers/deployment-hook";
import { createJobHookHandler, JOB_HOOK_EVENT } from "./handlers/job-hook";

/**
 * @param {import("../gitlab-webhook").Webhook} webhook
 * @param {import("telegraf").Telegraf} bot
 * @returns
 */
export function initializeGitlabBot(webhook, bot) {
  webhook.on(JOB_HOOK_EVENT, createJobHookHandler(bot));
  webhook.on(DEPLOYMENT_HOOK_EVENT, createDeploymentHookHandler(bot));
  webhook.on(PIPELINE_HOOK_EVENT, createPipelineHookHandler(bot));
}
