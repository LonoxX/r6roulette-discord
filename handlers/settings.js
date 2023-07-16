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
    var URL = `https://discordapp.com/api/webhooks/${config.Server.webhookid}/${config.Server.webhooktoken}`;
    fetch(URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        content: `Neuer Server **${guild.name}** - User **${guild.memberCount}**`,
        username: "R6 Roulette",
        avatar_url: "https://cdn.r6roulette.de/attacker/Ace.png"
      })
    })
    .then(response => {
    })
    .catch(err => console.error(err));
    
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
    var URL = `https://discordapp.com/api/webhooks/${config.Server.webhookid}/${config.Server.webhooktoken}`;
    fetch(URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        content: `Und weg ist er **${guild.name}**`,
        username: "R6 Roulette",
        avatar_url: "https://cdn.r6roulette.de/defender/Jager.png"
      })
    })
    .then(response => {
    })
    .catch(err => console.error(err));
  }
}


module.exports = {
  UpdateMemberCount,
  setLogChannel,
  addGuild,
  removeGuild
};