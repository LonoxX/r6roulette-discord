const { ShardingManager } = require("discord.js");
const config = require("./config.json");
const pawlog = require("./utility/logs.js");

const manager = new ShardingManager("./index.js", {
  token: config.Bot.Token,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  pawlog.shard(`Launched shard #${shard.id}`);
});
manager.spawn();
