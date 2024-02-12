const config = require("../../config.json");
const { addGuild } = require("../../handlers/settings.js");
module.exports = async (client, guild) => {
  addGuild(guild);
  console.log(`[GUILD JOIN] ${guild.id} added the bot.`);
};
