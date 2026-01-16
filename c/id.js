module.exports = {
  name: "id",
  description: "Get your Facebook user ID",
  usage: "id",
  aliases: ["userid"],
  adminonly: false,

  execute: async ({ sender, send }) => {
    await send(sender, "🆔 Your User ID: " + sender);
  }
};
