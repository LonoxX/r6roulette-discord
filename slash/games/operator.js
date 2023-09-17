const Discord = require("discord.js");
const { fetchOperatorData, createOperatorEmbed , getRandomOperator } = require('../../handlers/settings');

module.exports = {
  name: "operator",
  description: 'Generates a random operator',
  timeout: 3000,
  category: "games",
  usage: "/operator <attacker/defender>",
  options: [
    {
      name: 'operator_type',
      description: 'Choose the operator type',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Attacker',
          value: 'attacker',
        },
        {
          name: 'Defender',
          value: 'defender',
        },
      ],
    },
  ],
  
  run: async (interaction, client) => {
    try {
      const operatorType = interaction.options.getString('operator_type');
      const data = await fetchOperatorData(operatorType);
      const operator = getRandomOperator(data);
      const response = await createOperatorEmbed(operator, interaction, client);
      interaction.reply({ embeds: [response.embeds[0]], components: [response.components[0]] });
    } catch (error) {
      console.error('Error fetching operator:', error);
      interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  }
};

