const Discord = require("discord.js");
const fetch = require("cross-fetch");
const config = require("../../config.json");
const { getRandomChallenge, fetchChallengeData, createChallengeEmbed } = require("../../handlers/settings");
const pawlog = require("../../utility/logs.js");

module.exports = {
  name: "getchallenge",
  description: "Generates a random challenge",
  integration_types: [1],
  contexts: [0, 2],
  timeout: 3000,
  category: "games",
  usage: "/getchallenge",
  usageinDM: "yes",
  run: async (interaction, client) => {
    try {
      const challengeResponse = await fetchChallengeData();
      const challenge = getRandomChallenge(challengeResponse);
      const response = createChallengeEmbed(challenge, interaction, client); // Get the response object
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
    } catch (error) {
      pawlog.error("Error fetching challenge:", error);
      interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
  },
};
