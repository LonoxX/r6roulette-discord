const Timeout = new Set();
const config = require("../../config.json");
const { EmbedBuilder,codeBlock} = require("discord.js");
const { fetchOperatorData, createOperatorEmbed, getRandomOperator, fetchChallengeData, getRandomChallenge, createChallengeEmbed, getCommandinfo} = require('../../handlers/settings');

module.exports = async (client, interaction) => {
  switch (interaction.customId) {
    case "R6RouletteAttack":
      try {
      const data = await fetchOperatorData("attacker");
      const operator = getRandomOperator(data);
      const response = await createOperatorEmbed(operator, interaction, client);
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
      } catch (error) {
        console.error('Error fetching operator:', error);
        interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
      break;
    case "R6RouletteDefend":
      try {
        const data = await fetchOperatorData("defender");
      const operator = getRandomOperator(data);
      const response = await createOperatorEmbed(operator, interaction, client);
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
      } catch (error) {
        console.error('Error fetching operator:', error);
        interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
    break
    case "R6RouletteChallenge":
      try {
        const challengeResponse = await fetchChallengeData();
        const challenge = getRandomChallenge(challengeResponse);
        const response = createChallengeEmbed(challenge, interaction, client); // Get the response object
        interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
      } catch (error) {
        console.error('Error fetching challenge:', error);
        interaction.reply({ content: 'An error occurred.', ephemeral: true });
      }
      break;
      case "6roulettehelp":
      try {
        getCommandinfo(interaction, client);
      } catch (error) {
        console.error('error:', error);
      }
      break;

      default:
      break;
  }

  

  // Sonstiges
  if (interaction.type === 2) {
    if (!client.slash.has(interaction.commandName)) return;
    if (!interaction.guild) return;
    const command = client.slash.get(interaction.commandName);
    try {
      if (command.timeout) {
        if (Timeout.has(`${interaction.user.id}${command.name} `)) {
          const embed = new EmbedBuilder()
            .setTitle("Du befindest dich im einem Timeout!")
            .setDescription( `Du must noch ** ${humanizeDuration(command.timeout, { round: true,  })}** warten um den Befehl erneut zu verwenden` )
            .setColor(config.Bot.EmbedColor);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      if (command.permissions) {
        if (!interaction.member.permissions.has(command.permissions)) {
          const embed = new EmbedBuilder()
            .setTitle("Fehlende Berechtigung")
            .setColor(config.Bot.EmbedColor)
            .setDescription(  `: x: Du brauchst \`${command.permissions}\` um diesen Befehl zu verwenden` )
            .setTimestamp()
            .setFooter({ stext: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`, });
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      if (command.devs) {
        if (!config.Bot.OwnersID.includes(interaction.user.id)) {
          return interaction.reply({ content: ":x: Nur Entwickler können diesen Befehl verwenden", ephemeral: true, });
        }
      }
      if (command.ownerOnly) {
        if (interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({ content:  "Nur Eigentümer dieses Servers können diesen Befehl verwenden", ephemeral: true, });
        }
      }
      command.run(interaction, client);
      Timeout.add(`${interaction.user.id}${command.name}`);
      setTimeout(() => {
        Timeout.delete(`${interaction.user.id}${command.name}`);
      }, command.timeout);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content:  ":x: Beim Ausführen dieses Befehls ist ein Fehler aufgetreten!", ephemeral: true, });
    }
  }
};

