const getLogger = require("../../utility/logs.js");
module.exports = async (client, guild) => {
  UpdateServerCount(client);
  getLogger.info(`${client.user.tag} has left a server: ${guild.name} (${guild.id})`);
};
