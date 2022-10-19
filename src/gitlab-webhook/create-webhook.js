import { expressParser } from "./express-parser.js";
import { Webhook } from "./webhook.js";

export function createWebhook(options = {}) {
  if (!options.parser) {
    options.parser = expressParser;
  }

  return new Webhook(options);
}
