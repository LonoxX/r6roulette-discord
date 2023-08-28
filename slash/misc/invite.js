const Discord = require("discord.js");
const { EmbedBuilder,ActionRowBuilder, ButtonBuilder ,ButtonStyle } = require("discord.js");
const { getRandomColor } = require("../../handlers/colorlist.js");


module.exports = {
  name: "invite",
  description: 'Would you like invite me to your server?',
  timeout: 3000,
  run: async (interaction, client) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle('Invite me to your server!')
        .setColor(getRandomColor().hex)
        .setDescription('Click the link below to invite me to your server!')
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`, })
        .setTimestamp();

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Invite me!')
                .setStyle(ButtonStyle.Link)
                .setURL('https://pnnet.dev/r6discord'),
        )

        return interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Error sending invite:', error);
      interaction.reply({ content: 'X Error sending invite.', ephemeral: true });
    }
  }
};


