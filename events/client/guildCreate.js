const config = require("../../config.json");
const { addGuild } = require("../../handlers/settings.js");
const pawlog = require("../../utility/logs.js");
const axios = require("axios");
module.exports = async (client, guild) => {
  addGuild(guild);
  UpdateServerCount(client);
  pawlog.info(`${client.user.tag} has joined a new server: ${guild.name} (${guild.id})`);
  try {
    const response = await axios.post("http://178.63.98.239:1888/newguild", {
      botName: client.user.username,
      guild: guild,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
