import { STATUS_MAPPER } from "./constants.js";

export class MessageBuilder {
  constructor() {
    this.message = "";
  }

  setTitle(title) {
    this.message += title;

    return this;
  }

  addProperty(key, value, visible = true) {
    if (visible) {
      const line = !!value ? `<pre>${key}:</pre><b>${value}</b>\n` : "";

      this.message += line;
    }

    return this;
  }

  addUrlProperty(key, url, content) {
    const value = !!content ? `<a href="${url}">${content}</a>` : null;

    return this.addProperty(key, value);
  }

  getMessage() {
    return this.message;
  }
}

function createVariableGetter(variables) {
  return (key, defaultValue = null) => {
    if (!variables) {
      return defaultValue;
    }

    return variables.find((x) => x.key === key)?.value || defaultValue;
  };
}

function toHHMMSS(input) {
  var hours = Math.floor(input / 3600);
  var minutes = Math.floor((input - hours * 3600) / 60);
  var seconds = input - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return hours + ":" + minutes + ":" + seconds;
}

function getTitle(pipeline) {
  const { project, object_attributes, builds } = pipeline;

  const failedJob = builds.find((job) => job.status === "failed");
  const statusString =
    object_attributes.status === "success" && !!failedJob
      ? "warning"
      : object_attributes.status;
  const status = STATUS_MAPPER[statusString];

  const pipelineUrl = `${project.web_url}/-/pipelines/${object_attributes.id}`;

  const pipelineContent = `<a href="${pipelineUrl}">Pipeline #${object_attributes.id}</a>`;
  const repository = `<a href="${project.web_url}">${project.path_with_namespace}</a>`;

  return `${status} ${pipelineContent} of ${repository} is <b>${object_attributes.status}</b>\n`;
}

export function getPipelineMessage(pipeline) {
  const { object_attributes, commit, merge_request } = pipeline;
  const getVariable = createVariableGetter(object_attributes.variables);

  const environment = getVariable("TRANSFORM_CONFIG");
  const serviceName = getVariable("SERVICE_NAME");
  const tagName = object_attributes.tag ? object_attributes.ref : null;
  const isFinished = !!object_attributes.finished_at;

  const commitUrl = `<a href="${commit.url}">${commit.id.substring(0, 8)}</a>`;

  const duration =
    toHHMMSS(object_attributes.duration) +
    ` (queued for ${toHHMMSS(object_attributes.queued_duration)})`;

  const builder = new MessageBuilder();

  builder
    .setTitle(getTitle(pipeline))
    .addProperty("Service", serviceName || tagName)
    .addProperty("Environment", environment)
    .addUrlProperty("Merge Request", merge_request?.url, merge_request?.title)
    .addProperty("Commit", commitUrl + ` by ${commit.author.name}`)
    .addProperty("Duration", duration, isFinished);

  return { message: builder.getMessage(), format: { parse_mode: "HTML" } };
}
