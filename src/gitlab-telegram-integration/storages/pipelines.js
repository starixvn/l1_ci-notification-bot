import { Queue } from "./queue";

const pipelines = {
  messages: {},
};

export const pipelineQueue = new Queue();

export function getMessages(id) {
  return pipelines.messages[id];
}

export function addMessages(id, messages) {
  pipelines.messages[id] = messages;
}
