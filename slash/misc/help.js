const Discord = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType, EmbedBuilder, codeBlock } = require("discord.js");
const { getRandomColor } = require("../../utility/colorlist.js");

const pawlog = require("../../utility/logs.js");

module.exports = {
  name: "help",
  description: "❔ Display a list of all available commands",
  timeout: 3000,
  category: "misc",
  usage: "/help [command]",
  usageinDM: "yes",
  options: [
    {
      name: "query",
      description: "The full name of command or category",
      type: ApplicationCommandOptionType.String,
      max_length: 256,
      required: false,
    },
  ],
  run: async (interaction, client) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle("❔ Help")
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(getRandomColor().hex)
        .setDescription(`Use \`/help <command>\` or select a command from the dropdown menu below to get more information about a specific command.`)
        .setTimestamp()
        .setFooter({ text: `${client.user.username} `, iconURL: `${client.user.displayAvatarURL()}` });

      if (interaction.options.getString("query")) {
        const query = interaction.options.getString("query");
        const isCategory = client.slash.map((cmd) => cmd.category?.toLowerCase()).includes(query?.toLowerCase());

        if (!isCategory) {
          const command = client.slash.get(query.toLowerCase()) || client.slash.find((cmd) => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));

          if (!command) {
            return interaction.editReply({ ephemeral: true, content: `❌ The command \`${query}\` does not exist. Please check your spelling and try again.` });
          }

          embed.setTitle(`❔ Help for ${command.name}`);
          embed.addFields([
            { name: "Name", value: codeBlock(command.name), inline: true },
            { name: "Usage", value: codeBlock(command.usage), inline: true },
            { name: "Description", value: codeBlock(command.description) },
            { name: "Usage in DM", value: codeBlock(command.usageinDM), inline: true },
            { name: "Cooldown", value: codeBlock(`${command.timeout / 1000} seconds`), inline: true },
            { name: "Category", value: codeBlock(command.category), inline: true },
          ]);

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } else {
        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("R6RouletteHelp")
            .setPlaceholder("Select a command")
            .addOptions(
              client.slash.map((cmd) => ({
                label: cmd.name,
                value: cmd.name,
                description: cmd.description,
              })),
            ),
        );
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
      }
    } catch (err) {
      pawlog.error(err);
    }
  },
};
