const { ActivityType } = require("discord.js");
const cron = require("node-cron");
const { addGuild, UpdateMemberCount, UpdateServerCount, fetchChangelogData } = require("../../handlers/settings.js");
const db = require("../../handlers/database.js");
const SGuilds = require("../../models/guilds.js");
const Activity = require("../../models/activity.js");
const Advertisement = require("../../models/advertisement.js");
const pawlog = require("../../utility/logs.js");
module.exports = async (client) => {
  const data = await fetchChangelogData();
  const version = data[0].version;
  setInterval(() => {
    const activities = [{ text: "🤖 V " + version }, { text: "❔ /help" }, { text: "" + Math.ceil(client.guilds.cache.size) + " Guilds" }];
    let activity;
    db.authenticate()
      .then(async () => {
        const messages = await Activity.findAll({
          attributes: ["text"],
          raw: true,
        });
        messages.forEach((message) => {
          activities.push({ text: message.text });
        });
        activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity({ type: ActivityType.Custom, name: "irrelevant", state: activity.text });
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, 10000);
  //UpdateServerCount(client);
  pawlog.ready(`[Discord API] Logged in as ${client.user.tag}`);

  db.authenticate()
    .then(() => {
      SGuilds.init(db);
      SGuilds.sync();
      Activity.init(db);
      Activity.sync();
      Advertisement.init(db);
      Advertisement.sync();
      pawlog.database("[Database] Connection has been established successfully.");
      client.guilds.cache.forEach((guild) => {
        addGuild(guild);
      });
    })
    .catch((error) => {
      console.error(error);
      pawlog.critical("[Database] Unable to connect to the database:", error);
    });

  cron.schedule("0 8 * * *", async () => {
    try {
      UpdateServerCount(client);
      client.guilds.cache.forEach((guild) => {
        UpdateMemberCount(guild);
      });
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};
