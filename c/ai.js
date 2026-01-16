const { GPT4All } = require("gpt4all");

let model;
async function loadModel() {
  if (!model) {
    model = new GPT4All("orca-mini-3b.ggmlv3.q4_0.bin", {
      verbose: false
    });
    await model.init();
  }
}

module.exports = {
  name: "ai",
  description: "Ask the offline AI a question",
  usage: "ai <your question>",
  aliases: ["ask", "bot"],
  adminonly: false,

  execute: async ({ sender, args, send }) => {
    if (!args.length)
      return send(sender, "❌ Ask something.\nUsage: ai <question>");

    await loadModel();

    const prompt = args.join(" ");

    const response = await model.prompt(prompt, {
      maxTokens: 200,
      temperature: 0.7
    });

    await send(sender, response.slice(0, 1800));
  }
};
  
