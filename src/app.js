import express from "express";
import packageJson from "../package.json" assert { type: "json" };
import { defaultHandler, webhookHandler } from "./express-handler";
import { createWebhook } from "./gitlab-webhook";

const app = express();
const port = process.env.PORT || 5000;
const webhook = createWebhook();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", defaultHandler);
app.post("/", webhookHandler(webhook));

webhook.on("*", console.log);

app.listen(port, () => {
  console.log(`${packageJson.name} is listening at http://localhost:${port}`);
});
