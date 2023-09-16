const config = require("../../config.json");
const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { removeGuild, UpdateServerCount } = require('../../handlers/settings.js');
module.exports = async (client, guild) => {
  removeGuild(guild);
  UpdateServerCount(client);
  console.log(`${client.user.tag} has left a server: ${guild.name} (${guild.id})`);
  const READY = client.channels.cache.get(config.Bot.LogChannel);
  const NEWembed = new EmbedBuilder()
    .setTitle("Guild left")
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