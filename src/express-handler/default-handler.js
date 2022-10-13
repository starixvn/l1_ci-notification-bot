import packageJson from "../../package.json" assert { type: "json" };

export function defaultHandler(_, res) {
  res.send(`${packageJson.name} is running.`);
}
