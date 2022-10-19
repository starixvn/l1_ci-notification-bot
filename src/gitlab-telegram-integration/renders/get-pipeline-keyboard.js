import { Markup } from "telegraf";
import { STATUS_MAPPER } from "./constants.js";

export function getPipelineKeyboard(pipeline) {
  const jobs = pipeline.builds;
  const projectUrl = pipeline.project.web_url;
  const skippedJobs = {
    success: true,
    canceled: true,
    skipped: true,
  };

  const keyboards = jobs
    .filter((job) => !skippedJobs[job.status])
    .map((job) => {
      const { name, status, id } = job;
      const jobUrl = `${projectUrl}/-/jobs/${id}`;
      const statusIcon = ["running"].includes(status)
        ? STATUS_MAPPER[status]
        : "";

      return Markup.button.url(`${statusIcon} ${name}`, jobUrl);
    });

  return Markup.inlineKeyboard(keyboards, { columns: 2 });
}
