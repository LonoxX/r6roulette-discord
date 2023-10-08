const config = require("../../config.json");
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { addGuild, UpdateServerCount} = require('../../handlers/settings.js');
const getLogger = require("../../handlers/logs.js");
module.exports = async (client, guild) => {
  addGuild(guild);  
  UpdateServerCount(client);
  getLogger.info(`${client.user.tag} has joined a new server: ${guild.name} (${guild.id})`);
  const channel = client.channels.cache.get(guild.systemChannelId)
  const embed = new Discord.EmbedBuilder()
      .setTitle("Guild Joined")
      .setColor(config.Bot.EmbedColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }), })
      .setDescription(`Thank you for adding ${client.user.username} to your server! I am the Discord bot from [r6roulette.de](${config.Bot.Website}), and I provide the same functionality as the website.`)
      .addFields([
        { name: "Website:", value: `[Website](${config.Bot.Website})`, inline: true},
        { name: "Support Server:", value: `[Support Server](${config.Bot.SupportServer})`, inline: true},
        { name: "Vote:", value:`[Vote](${config.Bot.Vote})`, inline: true},
        { name: '\u200B', value: '\u200B'},
        { name: "Get a random operator", value:" `/operator`", inline: true},
        { name: "Get a random challenge", value:" `/getchallenge`", inline: true},
      ])
      .setTimestamp()
      .setFooter({ text: `${client.user.username} `,  iconURL: `${client.user.displayAvatarURL()}`, });
      channel.send({ embeds: [embed] })

      const READY = client.channels.cache.get(config.Bot.LogChannel);
      const NEWembed = new EmbedBuilder()
        .setTitle("Guild Joined")
        .setColor(config.Bot.EmbedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setAuthor({  name: guild.name, iconURL: guild.iconURL({ dynamic: true }),  })
        .addFields([
          { name: "Guild Name:", value: guild.name },
        ])
        .setTimestamp()
        .setFooter({  text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }),  });
      READY.send({ embeds: [NEWembed] });
};
