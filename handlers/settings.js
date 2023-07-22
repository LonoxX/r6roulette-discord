const SGuilds = require("./guilds.js");
const config = require("../config.json");

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


module.exports = {
  UpdateMemberCount,
  setLogChannel,
  addGuild,
  removeGuild
};