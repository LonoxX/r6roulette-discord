const config = require("../../config.json");
const db = require("../../handlers/database.js");
const SGuilds = require("../../handlers/guilds.js");
const Activity = require("../../handlers/activity.js");
const { addGuild ,UpdateMemberCount ,UpdateServerCount ,fetchChangelogData} = require('../../handlers/settings.js');
const { ActivityType ,EmbedBuilder } = require("discord.js");
const getLogger = require("../../utility/logs.js");
module.exports = async (client) => {
  const data = await fetchChangelogData();
  const version = data[0].version;
  setInterval(() => {
    const activities = [
      { text: "🚀" + Math.ceil(client.guilds.cache.size) + " Guilds" },
      { text: "🤖 V " + version },
      { text: "❔ /help" },
    ];
    let activity;
    db.authenticate()
      .then(async () => {
        const messages = await Activity.findAll({
          attributes: ['text'],
          raw: true,
        });
        messages.forEach(message => {
          activities.push({ text: message.text });
        });
        activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity({ type: ActivityType.Custom, name: "irrelevant", state: activity.text, })
      })
      .catch(err => {
        getLogger.critical(err);
        return;
      });
  }, 10000);

  setInterval(() => {
    client.guilds.cache.forEach(guild => {
      UpdateMemberCount(guild);
    });
  }, 10800000); // 3600000 Millisekunden = 1 Hour
    
UpdateServerCount(client);
getLogger.ready(`[Discord API] Logged in as ${client.user.tag}`);
db.authenticate()
  .then(() => {
    SGuilds.init(db);
    SGuilds.sync();
    Activity.init(db);
    Activity.sync();
    getLogger.database("[Database] Connection has been established successfully.");
    client.guilds.cache.forEach(guild => {
      addGuild(guild);
    });
  })
  .catch((error) => {
    getLogger.critical("[Database] Unable to connect to the database:", error);
  });

};