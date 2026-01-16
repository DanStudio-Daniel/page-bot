const path = require("path");
const {
  LlamaModel,
  LlamaContext,
  LlamaChatSession
} = require("node-llama-cpp");

let session;

async function loadModel() {
  if (session) return session;

  const model = new LlamaModel({
    modelPath: path.join(__dirname, "../models/tinyllama.gguf")
  });

  const context = new LlamaContext({ model });
  session = new LlamaChatSession({ context });

  return session;
}

module.exports = {
  name: "ai",
  description: "AI chat",
  usage: "ai <message>",
  aliases: ["ask"],
  adminonly: false,

  execute: async ({ sender, args, send }) => {
    if (!args.length)
      return send(sender, "❌ Usage: ai <message>");

    const chat = await loadModel();
    const prompt = args.join(" ");

    const reply = await chat.prompt(prompt, {
      maxTokens: 200
    });

    await send(sender, reply.slice(0, 1800));
  }
};
      
