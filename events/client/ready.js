const { ActivityType } = require("discord.js");
const cron = require("node-cron");
const { addGuild, UpdateMemberCount, UpdateServerCount, fetchChangelogData } = require("../../handlers/settings.js");
const db = require("../../handlers/database.js");
const SGuilds = require("../../models/guilds.js");
const Advertisement = require("../../models/advertisement.js");
const pawlog = require("../../utility/logs.js");
const axios = require('axios');
module.exports = async (client) => {
  const data = await fetchChangelogData();
  const version = data[0].version;
  setInterval(async () => {
    try {
    const activities = [{ text: "🤖 V " + version }, { text: "❔ /help" }, { text: "" + Math.ceil(client.guilds.cache.size) + " Guilds" }];
    const response = await axios.get('https://api.pnnet.dev/status/r6r');
    if (response.data && response.data.length > 0) {
      response.data.forEach((apiActivity) => {
        activities.push({ text: apiActivity.text });
      });
    }
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity({ type: ActivityType.Custom, name: "irrelevant", state: randomActivity.text });
    } catch (error) {
      console.error('Fehler bei der API-Anfrage:', error.message);
    }
  }, 10000);
  UpdateServerCount(client);
  pawlog.ready(`[Discord API] Logged in as ${client.user.tag}`);

  db.authenticate()
    .then(() => {
      SGuilds.init(db);
      SGuilds.sync();
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
      client.guilds.cache.forEach((guild) => {
        UpdateMemberCount(guild);
      });
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};
