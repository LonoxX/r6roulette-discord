const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomColor } = require("../../utility/colorlist.js");
const pawlog = require("../../utility/logs.js");

module.exports = {
  name: "test",
  description: "This is a test command",
  integration_types: [1], // This command can be installed in servers
  contexts: [0, 2], // This command can be used in servers and user DMs
  timeout: 3000,
  category: "misc",
  usage: "/test",
  run: async (interaction, client) => {
    await interaction.reply({ content: "Yes Sir!"});
  },
};
