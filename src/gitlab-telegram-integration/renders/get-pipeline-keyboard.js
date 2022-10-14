import { Markup } from "telegraf";
const statuses = {
  failed: "❌",
  warning: "⚠️",
  pending: "⏸️",
  running: "🟢",
  manual: "⚙️",
  scheduled: "🔄",
  canceled: "✖️",
  success: "✅",
  skipped: "⚫",
  created: "⚪",
};

export function getPipelineKeyboard(pipeline) {
  const jobs = pipeline.builds;
  const projectUrl = pipeline.project.web_url;

  const keyboards = jobs.map((job) => {
    const { name, status, id } = job;
    const jobUrl = `${projectUrl}/-/jobs/${id}`;

    return Markup.button.url(`${statuses[status]} ${name}`, jobUrl);
  });

  return Markup.inlineKeyboard(keyboards, { columns: 2 });
}
