const Discord = require("discord.js");
const { fetchOperatorData, createOperatorEmbed, getRandomOperator } = require("../../handlers/settings");
const pawlog = require("../../utility/logs.js");
module.exports = {
  name: "operator",
  description: "Generates a random operator",
  integration_types: [1], // This command can be installed in servers
  contexts: [0, 2], // This command can be used in servers and user DMs
  timeout: 3000,
  category: "games",
  usage: "/operator <attacker/defender>",
  usageinDM: "yes",
  options: [
    {
      name: "operator_type",
      description: "Choose the operator type",
      type: 3,
      required: true,
      choices: [
        {
          name: "Attacker",
          value: "attacker",
        },
        {
          name: "Defender",
          value: "defender",
        },
      ],
    },
  ],

  run: async (interaction, client) => {
    try {
      const operatorType = interaction.options.getString("operator_type");
      const data = await fetchOperatorData(operatorType);
      const operator = getRandomOperator(data);
      const response = await createOperatorEmbed(operator, interaction, client);
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
    } catch (error) {
      pawlog.error("Error fetching operator:", error);
      interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
  },
};
