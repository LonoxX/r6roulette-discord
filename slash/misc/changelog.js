const Discord = require("discord.js");
const { EmbedBuilder,ActionRowBuilder, ButtonBuilder ,ButtonStyle } = require("discord.js");
const { getLatestChangelog } = require("../../handlers/settings.js");
const { getRandomColor} = require("../../handlers/colorlist.js");
const config = require("../../config.json");


module.exports = {
  name: "changelog",
  description: 'Shows the latest changelog for the bot.',
  timeout: 3000,
  run: async (interaction, client) => {
    try {
      const changelogEmbed = await getLatestChangelog(interaction, client);
      interaction.reply({ embeds: [changelogEmbed]});
    } catch (error) {
      console.error('Error fetching changelog:', error);
      interaction.reply({ content: 'Error fetching changelog.', ephemeral: true });
    }
  }
};


