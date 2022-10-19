import { Queue } from "./queue.js";

const cacheDuration = 60000 * 60;

const pipelines = {
  messages: {},
  latestPipeline: {},
};

export const pipelineQueue = new Queue();

pipelineQueue.on("enqueue", (pipeline) => {
  const id = pipeline.object_attributes.id;

  pipelines.latestPipeline[id] = pipeline;

  setTimeout(() => {
    delete pipelines.latestPipeline[id];
  }, cacheDuration);
});

export function getMessages(id) {
  return pipelines.messages[id];
}

export function addMessages(id, messages) {
  pipelines.messages[id] = messages;

  setTimeout(() => {
    delete pipelines.messages[id];
  }, cacheDuration);
}

export function getLatestPipeline(id) {
  return pipelines.latestPipeline[id];
}
