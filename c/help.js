module.exports = {
  name: "help",
  description: "Show all commands",
  usage: "help",
  aliases: ["commands", "menu"],
  adminonly: false,

  execute: async ({ sender, send, commands }) => {
    let msg = "📖 Commands:\n\n";
    for (const c of commands) {
      msg += `• ${c.name}\n  ${c.description}\n  Usage: ${c.usage}\n\n`;
    }
    await send(sender, msg.trim());
  }
};
