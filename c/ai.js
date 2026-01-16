const gpt4all = require("gpt4all");

let model = null;

async function loadModel() {
  if (model) return model;

  model = await gpt4all.create({
    model: "orca-mini-3b.ggmlv3.q4_0.bin",
    verbose: false
  });

  return model;
}

module.exports = {
  name: "ai",
  description: "Ask AI",
  usage: "ai <question>",
  aliases: ["ask", "bot"],
  adminonly: false,

  execute: async ({ sender, args, send }) => {
    if (!args.length)
      return send(sender, "❌ Usage: ai <your question>");

    const ai = await loadModel();

    const prompt = args.join(" ");

    const reply = await ai.generate(prompt, {
      maxTokens: 200,
      temperature: 0.7
    });

    await send(sender, reply.slice(0, 1800));
  }
};
                                    
