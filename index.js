const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const config = require("./config.json");

const app = express();
app.use(bodyParser.json());

// Load handlers
const handlers = {};
fs.readdirSync("./h").forEach(f => {
  if (f.endsWith(".js")) {
    const name = f.replace(".js", "");
    handlers[name] = require("./h/" + f);
  }
});

// Load commands with metadata
const commands = [];
const commandMap = {};

fs.readdirSync("./c").forEach(f => {
  if (f.endsWith(".js")) {
    const cmd = require("./c/" + f);
    commands.push(cmd);
    commandMap[cmd.name] = cmd;
    if (cmd.aliases) {
      cmd.aliases.forEach(a => commandMap[a] = cmd);
    }
  }
});

app.get("/", (req, res) => {
  res.send("🤖 Facebook Page Bot is running");
});

app.get("/webhook", handlers.webhook.verify);
app.post("/webhook", (req, res) =>
  handlers.webhook.receive(req, res, commandMap, commands)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot running on " + PORT));
