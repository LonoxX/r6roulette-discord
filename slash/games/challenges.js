const Discord = require("discord.js");
const fetch = require('cross-fetch');
const config = require('../../config.json');
const { getRandomChallenge, fetchChallengeData, createChallengeEmbed} = require('../../handlers/settings');


module.exports = {
  name: "getchallenge",
  description: 'Generates a random challenge',
  timeout: 3000,
  run: async (interaction, client) => {
    try {
      const challengeResponse = await fetchChallengeData();
      const challenge = getRandomChallenge(challengeResponse);
      const response = createChallengeEmbed(challenge, interaction, client); // Get the response object
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
    } catch (error) {
      console.error('Error fetching challenge:', error);
      interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};


