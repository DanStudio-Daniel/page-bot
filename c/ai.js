let model = null;

async function loadModel() {
  if (model) return model;

  const { GPT4All } = await import("gpt4all");

  model = new GPT4All({
    model: "orca-mini-3b.ggmlv3.q4_0.bin",
    verbose: false
  });

  await model.init();
  return model;
}

module.exports = {
  name: "ai",
  description: "Ask the offline AI (no billing)",
  usage: "ai <question>",
  aliases: ["ask", "bot"],
  adminonly: false,

  execute: async ({ sender, args, send }) => {
    if (!args.length) {
      return send(sender, "❌ Usage: ai <your question>");
    }

    const ai = await loadModel();
    const prompt = args.join(" ");

    const response = await ai.prompt(prompt, {
      maxTokens: 200,
      temperature: 0.7
    });

    await send(sender, response.slice(0, 1800));
  }
};
      
