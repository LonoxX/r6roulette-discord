const { ActivityType } = require("discord.js");
const { UpdateServerCount, fetchChangelogData } = require("../../handlers/settings.js");
const getLogger = require("../../utility/logs.js");
module.exports = async (client) => {
  const data = await fetchChangelogData();
  const version = data[0].version;
  setInterval(() => {
    const activities = [{text: "🤖 V " + version }, { text: "❔ /help" }];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity({ type: ActivityType.Custom, name: "irrelevant", state: activity.text });
  }, 10000);
  UpdateServerCount(client);
  getLogger.ready(`[Discord API] Logged in as ${client.user.tag}`);
};
