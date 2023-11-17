const getLogger = require("../../utility/logs.js");
module.exports = async (client, guild) => {
  getLogger.info(`${client.user.tag} has joined a new server: ${guild.name} (${guild.id})`);
};
