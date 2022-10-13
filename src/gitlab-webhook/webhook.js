import { EventEmitter } from "events";

export const EVENT_ERROR = "error";

export class Webhook extends EventEmitter {
  constructor(options) {
    super();

    this.token = options.token;
    this.parser = options.parser;
  }

  process(raw) {
    if (this.parser) {
      const data = this.parser(raw);

      if (
        !!data &&
        this.authenticate(data.token) &&
        this.validateEvent(data.event)
      ) {
        this.emit(data.event, data.payload);
        this.emit("*", data.payload);
      }
    } else {
      const message = "No parser found in webhook";

      this.emit(EVENT_ERROR, message);
    }
  }

  authenticate(token) {
    if (this.token && this.token !== token) {
      const message =
        "No X-Gitlab-Token found on request or the token did not match";

      this.emit(EVENT_ERROR, message);

      return false;
    }

    return true;
  }

  validateEvent(event) {
    if (!event) {
      const message = "X-Gitlab-Event is not acceptable";

      this.emit(EVENT_ERROR, message);

      return false;
    }

    return true;
  }
}
