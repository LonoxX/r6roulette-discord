const SGuilds = require("./guilds.js");
const config = require("../config.json");
const { EmbedBuilder,ActionRowBuilder, ButtonBuilder ,ButtonStyle } = require("discord.js");
const fetch = require('cross-fetch');
const { getRandomColor } = require("./colorlist.js");
function UpdateMemberCount(guild) {
  let member = SGuilds.update({
    membercount: guild.memberCount,
  }, {
    where: {
      guildId: guild.id,
    },
  });
  console.log(`[Database] Update Member for Guild ${guild.name} (${guild.id})`);
}

function setLogChannel(guildid, channelId) {
  let log = SGuilds.update({
    logchannel: channelId,
  }, {
    where: {
      guildId: guildid,
    },
  });
}

async function addGuild(guild) {
  const server = await SGuilds.findOne({
    where: {
      guildId: guild.id
    }
  });
  if (!server) {
    await SGuilds.create({
      guildId: guild.id,
      prefix: config.Bot.Prefix,
      playground: null,
      membercount: guild.memberCount,
      created_at: new Date(),
    });
    console.log(`[Database] Added Guild (${guild.id}) to the database`);
  }
}

async function removeGuild(guild) {
  const server = await SGuilds.findOne({
    where: {
      guildId: guild.id
    }
  });
  if (server) {
    await SGuilds.destroy({
      where: {
        guildId: guild.id
      }
    });
    console.log(`[Database] Removed Guild (${guild.id}) from the database`);
  }
}

// Function to fetch operator data
async function fetchOperatorData(operatorType) {
  const response = await fetch(`https://api.r6roulette.de/role/${operatorType}?api_key=${config.Bot.Apikey}`);
  const data = await response.json();
  return data;
}

// Function to get a random item from an array
function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to get a random weapon based on type
function getRandomWeapon(weapons, weaponType) {
  const filteredWeapons = weapons.filter(weapon => weapon.weapon_type === weaponType);
  return getRandomFromArray(filteredWeapons);
}

// Function to get a random grip
function getRandomGrip(gripes) {
  return getRandomFromArray(gripes);
}

// Function to get a random attachment
function getRandomAttachment(attachments) {
  return getRandomFromArray(attachments);
}

// Function to get a random scope
function getRandomScope(scopes) {
  return getRandomFromArray(scopes);
}

function getRandomOperator(operators) {
  const chosen = getRandomFromArray(operators);
  const randomPrimary = getRandomWeapon(chosen.weapons, 'primary');
  const randomSecondary = getRandomWeapon(chosen.weapons, 'secondary');
  const randomGadget = getRandomFromArray(chosen.gadgets);
  
  const secondaryGrip = randomSecondary.gripes ? getRandomGrip(randomSecondary.gripes) : null;

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
    secondaryGrip: secondaryGrip,
    secondaryScope: getRandomScope(randomSecondary.scopes),
    gadget: randomGadget.gadget_name
  };
}

function createOperatorEmbed(operator, interaction, client) {
  const embed = new EmbedBuilder()
    .setTitle(operator.name)
    .setThumbnail(operator.badge)
    .setColor(getRandomColor().hex)
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
    .addFields([
      { name: 'Primary Weapon', value: operator.primaryWeapon },
      { name: 'Attachment', value: operator.primaryAttachment, inline: true },
      { name: 'Grip', value: operator.primaryGrip, inline: true },
      { name: 'Scope', value: operator.primaryScope, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Secondary Weapon', value: operator.secondaryWeapon },
      { name: 'Attachment', value: operator.secondaryAttachment, inline: true },
      { name: 'Grip', value: operator.secondaryGrip, inline: true },
      { name: 'Scope', value: operator.secondaryScope, inline: true },
      { name: 'Gadget', value: operator.gadget, inline: true }
    ])
    .setTimestamp()
    .setFooter({ text: `${client.user.username} `, iconURL: `${client.user.displayAvatarURL()}` });

  // Add buttons for Attack and Defend
  const row = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setLabel('Attack')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('R6RouletteAttack'),
      new ButtonBuilder()
          .setLabel('Defend')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('R6RouletteDefend'),
  )
  return { embeds: [embed], components: [row] };
}

function getRandomChallenge(challenges) {
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function createChallengeEmbed(challenge, client) {
  const embed = new EmbedBuilder()
    .setTitle("Challenge")
    .setColor(getRandomColor().hex)
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


module.exports = {
  UpdateMemberCount,
  setLogChannel,
  addGuild,
  removeGuild,

  fetchOperatorData,
  getRandomFromArray,
  getRandomWeapon,
  getRandomGrip,
  getRandomAttachment,
  getRandomScope,
  getRandomOperator,
  createOperatorEmbed,
  getRandomChallenge,
  createChallengeEmbed
};