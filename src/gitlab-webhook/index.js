import { expressParser } from "./express-parser";
import { Webhook } from "./webhook";

export * from "./webhook";

export function createWebhook(options = {}) {
  if (!options.parser) {
    options.parser = expressParser;
  }

  return new Webhook(options);
}
