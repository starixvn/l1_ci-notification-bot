import "./configs/app-config.js";
import express from "express";
import packageJson from "../package.json" assert { type: "json" };
import { defaultHandler, webhookHandler } from "./express-handlers/index.js";
import { createWebhook } from "./gitlab-webhook/index.js";
import { createBot } from "./telegram-bot/index.js";
import { initializeGitlabBot } from "./gitlab-telegram-integration/index.js";

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
