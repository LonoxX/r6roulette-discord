const Discord = require("discord.js");
const { MessageActionRow, EmbedBuilder, MessageButton } = require("discord.js");
const fetch = require('cross-fetch');
const config = require('../../config.json');

module.exports = {
  name: "getchallenge",
  description: 'Generates a random challenge',
  timeout: 3000,
  run: async (interaction, client) => {
    try {
      const challengeResponse = await fetch(`https://api.r6roulette.de/challenges?api_key=${config.Bot.Apikey}`);
      const challengeData = await challengeResponse.json();
      const challenge = getRandomChallenge(challengeData);
      const embed = createOperatorEmbed(challenge);
      interaction.reply({ embeds: [embed]});
    } catch (error) {
      console.error('Error fetching challenge:', error);
      interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }

    function getRandomChallenge(challenges) {
      return challenges[Math.floor(Math.random() * challenges.length)];
    }

    function createOperatorEmbed(challenge) {
      const embed = new EmbedBuilder()
        .setTitle("Challenge")
        .setColor(config.Bot.EmbedColor)
        .addFields(
          { name: '🇩🇪 Challenge Title', value: challenge.title_german, inline: true },
          { name: 'Challenge Description', value: challenge.description_german, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '🇺🇸 Challenge Title', value: challenge.title_english, inline: true },
          { name: 'Challenge Description', value: challenge.description_english, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `${client.user.username} `,  iconURL: `${client.user.displayAvatarURL()}`, });
      return embed;
    }
  },
};


