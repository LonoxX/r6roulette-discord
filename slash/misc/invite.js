const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomColor } = require("../../utility/colorlist.js");
const pawlog = require("../../utility/logs.js");

module.exports = {
  name: "invite",
  description: "Would you like invite me to your server?",
  timeout: 3000,
  category: "misc",
  usage: "/invite",
  usageinDM: "yes",
  run: async (interaction, client) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Invite me to your server!")
        .setColor(getRandomColor().hex)
        .setDescription("Click the link below to invite me to your server!")
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Invite me!").setStyle(ButtonStyle.Link).setURL("https://pnnet.dev/r6discord"));

      return interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      pawlog.error("Error sending invite:", error);
      interaction.reply({ content: "X Error sending invite.", ephemeral: true });
    }
  },
};
