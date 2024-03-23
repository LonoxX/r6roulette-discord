const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomColor } = require("../../utility/colorlist.js");
const config = require("../../config.json");
const pawlog = require("../../utility/logs.js");

module.exports = {
  name: "donate",
  description: "View your current donation status and get a link to donate.",
  timeout: 3000,
  category: "misc",
  usage: "/donate",
  usageinDM: "no",
  run: async (interaction, client) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Donate to support the development of ${client.user.username}`)
        .setColor(getRandomColor().hex)
        .setDescription("Your donation rank: **Standard**")
        .addFields({ name: "Why donate?", value: "Your donations enable us to further develop and improve the bot." }, { name: "Benefits of donation rank", value: "- Donate Role in Discord\n- Thank you in the support server" }, { name: "Support Server", value: `[Join](https://pnnet.dev/discord)`, inline: true })
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setLabel("Github").setStyle(ButtonStyle.Link).setURL(config.Donate.Github))

        .addComponents(new ButtonBuilder().setLabel("Ko-Fi").setStyle(ButtonStyle.Link).setURL(config.Donate.Github))

        .addComponents(new ButtonBuilder().setLabel("PayPal").setStyle(ButtonStyle.Link).setURL(config.Donate.PayPal));
      return interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      pawlog.error("Error sending invite:", error);
      interaction.reply({ content: "X Error sending invite.", ephemeral: true });
    }
  },
};
