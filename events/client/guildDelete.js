const config = require("../../config.json");
const { removeGuild } = require("../../handlers/settings.js");
module.exports = async (client, guild) => {
  removeGuild(guild);
  console.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
};
