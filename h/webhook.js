const axios = require("axios");
const config = require("../config.json");

exports.verify = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === config.VERIFY_TOKEN)
    return res.status(200).send(challenge);
  res.sendStatus(403);
};

exports.receive = async (req, res, commandMap, commands) => {
  const event = req.body.entry?.[0]?.messaging?.[0];
  if (!event?.message?.text) return res.sendStatus(200);

  const sender = event.sender.id;
  const text = event.message.text.trim();
  const args = text.split(/\s+/);
  const name = args.shift().toLowerCase();

  const cmd = commandMap[name];
  if (!cmd) return res.sendStatus(200);

  if (cmd.adminonly && !config.ADMINS.includes(sender))
    return send(sender, "⛔ Admin only command.");

  await cmd.execute({ sender, args, send, commands });
  res.sendStatus(200);
};

async function send(id, text) {
  await axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`,
    { recipient: { id }, message: { text } }
  );
}
