const SGuilds = require("./guilds.js");
const config = require("../config.json");
const { EmbedBuilder ,ActionRowBuilder , ButtonBuilder ,ButtonStyle ,codeBlock } = require("discord.js");
const fetch = require('cross-fetch');
const { AutoPoster } = require('topgg-autoposter')
const { getRandomColor } = require("./colorlist.js");
const getLogger = require("./logs.js");

function UpdateMemberCount(guild) {
  let member = SGuilds.update({
    membercount: guild.memberCount,
  }, {
    where: {
      guildId: guild.id,
    },
  });
  getLogger.database(`Update Member for Guild ${guild.name} (${guild.id})`);
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
    getLogger.database(`Added Guild (${guild.id}) to the database`);
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
    getLogger.database(`Removed Guild (${guild.id}) from the database`);
  }
}

async function UpdateServerCount(client) {
  const poster = AutoPoster(config.Bot.topgg, client)
  poster.on('posted', (stats) => {
    getLogger.info(`[Top.gg] Posted stats to top.gg: ${stats.serverCount} servers`)
  })
  poster.on('error', (e) => {
    getLogger.warn('[Top.gg] Error posting stats to top.gg:', e)
  })
}

async function fetchOperatorData(operatorType) {
  const response = await fetch(`https://api.r6roulette.de/role/${operatorType}?api_key=${config.Bot.Apikey}`);
  const data = await response.json();
  return data;
}

function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomWeapon(weapons, weaponType) {
  const filteredWeapons = weapons.filter(weapon => weapon.weapon_type === weaponType);
  return getRandomFromArray(filteredWeapons);
}

function getRandomGrip(gripes) {
  return getRandomFromArray(gripes);
}

function getRandomAttachment(attachments) {
  return getRandomFromArray(attachments);
}

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

async function createOperatorEmbed(operator, interaction, client) {
  const Changelog = await fetchChangelogData();
  const embed = new EmbedBuilder()
    .setTitle(operator.name)
    .setThumbnail(operator.badge)
    .setColor(getRandomColor().hex)
    .setAuthor({ name: operator.name, iconURL: operator.badge })
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
      { name: 'Gadget', value: operator.gadget, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Requested by', value: interaction.user.username }
    ])
    .setTimestamp()
    .setFooter({ text: `Ubisoft Patch Support: ${Changelog[0].Upatch}`,  iconURL: `${client.user.displayAvatarURL()}`, });

  const row = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setLabel('Attack')
          .setStyle(ButtonStyle.Success)
          .setCustomId('R6RouletteAttack'),
      new ButtonBuilder()
          .setLabel('Defend')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('R6RouletteDefend'),
  )


      
  return { embeds: [embed], components: [row] };
}

async function fetchChallengeData() {
  const response = await fetch(`https://api.r6roulette.de/challenges?api_key=${config.Bot.Apikey}`);
  const data = await response.json();
  return data;
}


function getRandomChallenge(challenges) {
  return challenges[Math.floor(Math.random() * challenges.length)];
}

function createChallengeEmbed(challenge,interaction, client) {
  if (!challenge) {
    getLogger.error('Challenge is undefined');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("Challenge")
    .setColor(getRandomColor().hex)
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
    .addFields(
      { name: '🇩🇪 Challenge Title', value: challenge.title_german, inline: true },
      { name: 'Challenge Description', value: challenge.description_german, inline: true },
      { name: '\u200B', value: '\u200B'},
      { name: '🇺🇸 Challenge Title', value: challenge.title_english, inline: true },
      { name: 'Challenge Description', value: challenge.description_english, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
    
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('New Challenge')
            .setStyle(ButtonStyle.Success)
            .setCustomId('R6RouletteChallenge'),
    )
    .addComponents(
      new ButtonBuilder()
          .setLabel('Request a Challenge')
          .setStyle(ButtonStyle.Link)
          .setURL('https://request.r6roulette.de'),
  )
    return { embeds: [embed], components: [row] };
}

async function fetchChangelogData() {
  const response = await fetch(`https://api.r6roulette.de/changelog/bot/latest?api_key=${config.Bot.Apikey}`);
  const data = await response.json();
  return data;
}

async function getLatestChangelog(interaction, client) {
  try {
    const data = await fetchChangelogData();
    const type = ['attacker', 'defender'];
    const operatorType = type[Math.floor(Math.random() * type.length)];
    const operator = await fetchOperatorData(operatorType);
    const output = getRandomOperator(operator);

    const embed = new EmbedBuilder()
      .setTitle(`Changelog \`${data[0].version}\``)
      .setColor(getRandomColor().hex)
      .setThumbnail(output.badge)
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .addFields([
        { name: 'Changes', value: data[0].message},
        { name: 'Ubisoft Patch Support', value: data[0].Upatch, inline: true }
      ])
      .setFooter({ text: `Created at ${data[0].created_at}`, iconURL: interaction.user.displayAvatarURL() });

    return embed;
  } catch (error) {
    getLogger.error('Error fetching changelog:', error);
    return null;
  }
}


async function getCommandinfo(interaction, client) {
  
  const query = interaction.values[0];
  const command = client.slash.get(query.toLowerCase()) || client.slash.find((cmd) => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));

  const embed = new EmbedBuilder()
    .setTitle(`❔ Help for ${command.name}`)
    .addFields([
      { name: "Name", value: codeBlock(command.name), inline: true, },
      { name: "Usage", value: codeBlock(command.usage), inline: true, },
      { name: "Description", value: codeBlock(command.description), },
      { name: "Cooldown", value: codeBlock(`${command.timeout / 1000} seconds`), inline: true, },
      { name: "Category", value: codeBlock(command.category), inline: true, },
    ])
    .setColor(getRandomColor().hex)
    .setTimestamp()
    .setFooter({ text: `${client.user.username} `, iconURL: `${client.user.displayAvatarURL()}`, });
  await interaction.reply({ content: `❔ Help for ${command.name}`, embeds: [embed] , ephemeral: true});
}




module.exports = {
  UpdateMemberCount,
  addGuild,
  removeGuild,
  UpdateServerCount,
  fetchOperatorData,
  getRandomFromArray,
  getRandomWeapon,
  getRandomGrip,
  getRandomAttachment,
  getRandomScope,
  getRandomOperator,
  createOperatorEmbed,
  fetchChallengeData,
  getRandomChallenge,
  createChallengeEmbed,
  getLatestChangelog,
  fetchChangelogData,
  getCommandinfo,
};