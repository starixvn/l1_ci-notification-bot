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
  const stages = pipeline.object_attributes.stages;
  const jobSorter = (a, b) => stages.indexOf(a) - stages.indexOf(b);
  const jobs = pipeline.builds.sort(jobSorter);

  const keyboards = jobs.map((job) => {
    const { name, status } = job;

    return Markup.button.url(
      `${statuses[status]} ${name}`,
      "https://google.com"
    );
  });

  return Markup.inlineKeyboard(keyboards, { columns: 2 });
}
