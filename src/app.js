import "./configs/app-config";
import express from "express";
import packageJson from "../package.json" assert { type: "json" };
import { defaultHandler, webhookHandler } from "./express-handlers";
import { createWebhook } from "./gitlab-webhook";
import { createBot } from "./telegram-bot";
import { initializeGitlabBot } from "./gitlab-bot";

const app = express();
const port = process.env.PORT || 5000;
const webhook = createWebhook();
const bot = createBot();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", defaultHandler);
app.post("/", webhookHandler(webhook));

initializeGitlabBot(webhook, bot);

bot.launch();

app.listen(port, () => {
  console.log(`${packageJson.name} is listening at http://localhost:${port}`);
});
