import { getLatestPipeline, pipelineQueue } from "../storages/index.js";

export const JOB_HOOK_EVENT = "Job Hook";

/**
 * @param {import("telegraf").Telegraf} bot
 */
export function createJobHookHandler() {
  return async (job) => {
    const pipeline = getLatestPipeline(job.pipeline_id);

    if (pipeline) {
      const newPipeline = JSON.parse(JSON.stringify(pipeline));

      newPipeline.builds.forEach((jobInPipeline) => {
        if (jobInPipeline.id === job.build_id) {
          jobInPipeline.status = job.build_status;
        }
      });

      pipelineQueue.enqueue(newPipeline);
    }
  };
}
