const config = require("../../config.json");
const { removeGuild } = require("../../handlers/settings.js");
const pawlog = require("../../utility/logs.js");
const axios = require("axios");
module.exports = async (client, guild) => {
  removeGuild(guild);
  pawlog.info(`${client.user.tag} has left a server: ${guild.name} (${guild.id})`);
  try {
    const response = await axios.post("http://178.63.98.239:1888/leftguild", {
      botName: client.user.username,
      guild: guild,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
