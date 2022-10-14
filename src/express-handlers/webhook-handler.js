/**
 * @param {import("../gitlab-webhook").Webhook} webhook
 */
export function webhookHandler(webhook) {
  return (request, response) => {
    webhook.once("error", (error) => {
      response.statusCode = 400;
      response.send({ error });
    });

    webhook.once("*", () => {
      response.send({ ok: true });
    });

    webhook.process(request);
  };
}
