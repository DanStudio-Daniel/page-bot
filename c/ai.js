const { spawn } = require("child_process");
const path = require("path");

module.exports = {
  name: "ai",
  description: "Offline AI chat (no billing, local model)",
  usage: "ai <your question>",
  aliases: ["ask", "bot"],
  adminonly: false,

  execute: async ({ sender, args, send }) => {
    if (!args.length) {
      return send(sender, "❌ Usage: ai <your question>");
    }

    const prompt = args.join(" ");

    const llamaPath = path.join(__dirname, "../bin/llama");
    const modelPath = path.join(__dirname, "../models/tinyllama.gguf");

    const proc = spawn(llamaPath, [
      "-m", modelPath,
      "-p", prompt,
      "-n", "200",
      "--temp", "0.7"
    ]);

    let output = "";
    let error = "";

    proc.stdout.on("data", d => output += d.toString());
    proc.stderr.on("data", d => error += d.toString());

    proc.on("close", () => {
      if (error) {
        return send(sender, "❌ AI error:\n" + error.slice(0, 1500));
      }
      send(sender, output.slice(0, 1800));
    });
  }
};
