const Discord = require("discord.js");
const { MessageActionRow, EmbedBuilder, MessageButton } = require("discord.js");
const fetch = require('cross-fetch');
const config = require('../../config.json');

module.exports = {
  name: "r6",
  description: 'Generates a random Rainbow Six Siege operator',
  timeout: 3000,
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
    const operatorType = interaction.options.getString('operator_type');

    if (operatorType !== 'attacker' && operatorType !== 'defender') {
      interaction.reply({ content: 'Please specify either "attacker" or "defender".', ephemeral: true });
      return;
    }

    try {
      const response = await fetch(`https://api.r6roulette.de/role/${operatorType}`);
      const data = await response.json();
      const operator = getRandomOperator(data);
      const embed = createOperatorEmbed(operator);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching operator:', error);
      interaction.reply({ content: 'An error occurred.', ephemeral: true });
    }
  },
};

function getRandomOperator(operators) {
  const chosen = operators[Math.floor(Math.random() * operators.length)];
  const randomPrimary = getRandomWeapon(chosen.weapons, 'primary');
  const randomSecondary = getRandomWeapon(chosen.weapons, 'secondary');
  const randomGadget = chosen.gadgets[Math.floor(Math.random() * chosen.gadgets.length)];

  return {
    name: chosen.name,
    img: chosen.img,
    badge: chosen.badge,
    primaryWeapon: randomPrimary.weapon_name,
    primaryAttachment: getRandomAttachment(randomPrimary.attachments),
    primaryGrip: getRandomGrip(randomPrimary.gripes),
    primaryScope: getRandomScope(randomPrimary.scopes),
    secondaryWeapon: randomSecondary.weapon_name,
    secondaryAttachment: getRandomAttachment(randomSecondary.attachments),
    secondaryGrip: getRandomGrip(randomSecondary.gripes),
    secondaryScope: getRandomScope(randomSecondary.scopes),
    gadget: randomGadget.gadget_name
  };
}

function getRandomWeapon(weapons, weaponType) {
  const filteredWeapons = weapons.filter(weapon => weapon.weapon_type === weaponType);
  return filteredWeapons[Math.floor(Math.random() * filteredWeapons.length)];
}

function getRandomAttachment(attachments) {
  return attachments[Math.floor(Math.random() * attachments.length)];
}

function getRandomGrip(gripes) {
  return gripes[Math.floor(Math.random() * gripes.length)];
}

function getRandomScope(scopes) {
  return scopes[Math.floor(Math.random() * scopes.length)];
}

function createOperatorEmbed(operator) {

    const embed = new EmbedBuilder()
        .setTitle(operator.name)
        .setImage(operator.img)
        .setThumbnail(operator.badge)
        .addFields([
            { name: 'Primary Weapon', value: operator.primaryWeapon , inline: true},
            { name: 'Attachment', value: operator.primaryAttachment , inline: true},
            { name: 'Grip', value: operator.primaryGrip , inline: true},
            { name: 'Scope', value: operator.primaryScope , inline: true},
            { name: 'Secondary Weapon', value: operator.secondaryWeapon , inline: true},
            { name: 'Attachment', value: operator.secondaryAttachment , inline: true},
            { name: 'Grip', value: operator.secondaryGrip , inline: true},
            { name: 'Scope', value: operator.secondaryScope , inline: true},
            { name: 'Gadget', value: operator.gadget , inline: true},
          ])
        //.setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setTimestamp()
        //.setFooter(client.user.username, client.user.displayAvatarURL());
  return embed;
}
