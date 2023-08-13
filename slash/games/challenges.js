const Discord = require("discord.js");
const { MessageActionRow, EmbedBuilder, MessageButton } = require("discord.js");
const fetch = require('cross-fetch');
const config = require('../../config.json');
const { getRandomChallenge, createChallengeEmbed} = require('../../handlers/settings');


module.exports = {
  name: "getchallenge",
  description: 'Generates a random challenge',
  timeout: 3000,
  run: async (interaction, client) => {
    try {
      const challengeResponse = await fetch(`https://api.r6roulette.de/challenges?api_key=${config.Bot.Apikey}`);
      const challengeData = await challengeResponse.json();
      const challenge = getRandomChallenge(challengeData);
      const embed = createChallengeEmbed(challenge, client);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching challenge:', error);
      interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};


