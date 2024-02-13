const config = require("../config.json");
const SGuilds = require("../models/guilds.js");
const Advertisement = require("../models/advertisement.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } = require("discord.js");
const fetch = require("cross-fetch");
const { AutoPoster } = require("topgg-autoposter");
const { getRandomColor } = require("../utility/colorlist.js");
const pawlog = require("../utility/logs.js");

function UpdateMemberCount(guild) {
  let member = SGuilds.update(
    {
      membercount: guild.memberCount,
    },
    {
      where: {
        guildId: guild.id,
      },
    },
  );
}

async function addGuild(guild) {
  const server = await SGuilds.findOne({
    where: {
      guildId: guild.id,
    },
  });
  if (!server) {
    await SGuilds.create({
      guildId: guild.id,
      membercount: guild.memberCount,
      created_at: new Date(),
    });
  }
}

async function removeGuild(guild) {
  const server = await SGuilds.findOne({
    where: {
      guildId: guild.id,
    },
  });
  if (server) {
    await SGuilds.destroy({
      where: {
        guildId: guild.id,
      },
    });
  }
}

async function UpdateServerCount(client) {
  const poster = AutoPoster(config.Bot.topgg, client);
  poster.on("posted", (stats) => {
    pawlog.info(`[Top.gg] Posted stats to top.gg: ${stats.serverCount} servers`);
  });
  poster.on("error", (e) => {
    pawlog.warn("[Top.gg] Error posting stats to top.gg:", e);
  });
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
  const filteredWeapons = weapons.filter((weapon) => weapon.weapon_type === weaponType);
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
  const randomPrimary = getRandomWeapon(chosen.weapons, "primary");
  const randomSecondary = getRandomWeapon(chosen.weapons, "secondary");
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
    gadget: randomGadget.gadget_name,
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
      { name: "Primary Weapon", value: operator.primaryWeapon },
      { name: "Attachment", value: operator.primaryAttachment, inline: true },
      { name: "Grip", value: operator.primaryGrip, inline: true },
      { name: "Scope", value: operator.primaryScope, inline: true },
      { name: "\u200B", value: "\u200B" },
      { name: "Secondary Weapon", value: operator.secondaryWeapon },
      { name: "Attachment", value: operator.secondaryAttachment, inline: true },
      { name: "Grip", value: operator.secondaryGrip, inline: true },
      { name: "Scope", value: operator.secondaryScope, inline: true },
      { name: "Gadget", value: operator.gadget, inline: true },
      { name: "\u200B", value: "\u200B" },
      { name: "Requested by", value: interaction.user.username },
    ])
    .setTimestamp()
    .setFooter({ text: `Ubisoft Patch Support: ${Changelog[0].Upatch}`, iconURL: `${client.user.displayAvatarURL()}` });

  const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Attack").setStyle(ButtonStyle.Success).setCustomId("R6RouletteAttack"), new ButtonBuilder().setLabel("Defend").setStyle(ButtonStyle.Danger).setCustomId("R6RouletteDefend"));

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

function createChallengeEmbed(challenge, interaction, client) {
  if (!challenge) {
    pawlog.error("Challenge is undefined");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("Challenge")
    .setColor(getRandomColor().hex)
    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
    .addFields({ name: "🇩🇪 Challenge Title", value: challenge.title_german, inline: true }, { name: "Challenge Description", value: challenge.description_german, inline: true }, { name: "\u200B", value: "\u200B" }, { name: "🇺🇸 Challenge Title", value: challenge.title_english, inline: true }, { name: "Challenge Description", value: challenge.description_english, inline: true })
    .setTimestamp()
    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

  const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("New Challenge").setStyle(ButtonStyle.Success).setCustomId("R6RouletteChallenge")).addComponents(new ButtonBuilder().setLabel("Request a Challenge").setStyle(ButtonStyle.Link).setURL("https://request.r6roulette.de"));
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
    const embed = new EmbedBuilder()
      .setTitle(`Changelog \`${data[0].version}\``)
      .setColor(getRandomColor().hex)
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .addFields([
        { name: "Changes", value: data[0].message },
        { name: "Ubisoft Patch Support", value: data[0].Upatch, inline: true },
      ])
      .setFooter({ text: `Created at ${data[0].created_at}`, iconURL: `${client.user.displayAvatarURL()}` });

    return embed;
  } catch (error) {
    pawlog.error("Error fetching changelog:", error);
    return null;
  }
}

async function getCommandinfo(interaction, client) {
  const query = interaction.values[0];
  const command = client.slash.get(query.toLowerCase()) || client.slash.find((cmd) => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));

  const embed = new EmbedBuilder()
    .setTitle(`❔ Help for ${command.name}`)
    .addFields([
      { name: "Name", value: codeBlock(command.name), inline: true },
      { name: "Usage", value: codeBlock(command.usage), inline: true },
      { name: "Description", value: codeBlock(command.description) },
      { name: "Cooldown", value: codeBlock(`${command.timeout / 1000} seconds`), inline: true },
      { name: "Category", value: codeBlock(command.category), inline: true },
    ])
    .setColor(getRandomColor().hex)
    .setTimestamp()
    .setFooter({ text: `${client.user.username} `, iconURL: `${client.user.displayAvatarURL()}` });
  await interaction.reply({ content: `❔ Help for ${command.name}`, embeds: [embed], ephemeral: true });
}

async function getAdData() {
  try {
    const ads = await Advertisement.findAll();
    const randomAd = ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;
    return randomAd;
  } catch (error) {
    console.error("Error fetching advertisement data:", error);
    throw error;
  }
}

async function createAdEmbed(client) {
  try {
    const adData = await getAdData();

    if (!adData) {
      const defaultAdEmbed = new EmbedBuilder()
        .setTitle(`Help ${client.user.username}'s development`)
        .setColor(getRandomColor().hex)
        .setDescription(`${client.user.username} is accepting donations to support its continued development.\nLearn more with **/donate**`)
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTimestamp()
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` });
      return defaultAdEmbed;
    }

    const adEmbed = new EmbedBuilder()
      .setTitle(adData.title)
      .setColor(getRandomColor().hex)
      .setDescription(adData.description)
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .addFields([{ name: "Support Server", value: `[Join](https://pnnet.dev/discord)`, inline: true }])
      .setTimestamp()
      .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` });

    return adEmbed;
  } catch (error) {
    console.error("Error creating advertisement embed:", error);
    throw error;
  }
}

module.exports = {
  addGuild,
  removeGuild,
  UpdateMemberCount,
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
  createAdEmbed,
};
