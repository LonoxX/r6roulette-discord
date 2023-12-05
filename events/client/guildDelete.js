const { UpdateServerCount } = require("../../handlers/settings.js");
module.exports = async (client, guild) => {
  UpdateServerCount(client);
};
