const { UpdateServerCount } = require("../../handlers/settings.js");
const getLogger = require("../../utility/logs.js");
module.exports = async (client, guild) => {
  UpdateServerCount(client);
  getLogger.info(`${client.user.tag} has joined a new server: ${guild.name} (${guild.id})`);
};
