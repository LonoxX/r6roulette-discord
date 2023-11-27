const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const client = require("../index.js");
const config = require("../config.json");
const pawlog = require("./logs.js");
const { getRandomColor, convertHexToInt } = require("./colorlist.js");
const express = require("express");
const Topgg = require("@top-gg/sdk");
const axios = require("axios");
const app = express();
const port = 3000;
const webhook = new Topgg.Webhook("vote");
const webhookURL = "https://discord.com/api/webhooks/1178793176480370738/DRUm8DZ2XqnTMhfCc20CGN5DLKTJHPIYv9zH9gyfTgj3z136ECjIog3INd3JIXUZ9UbD";

app
  .listen(port, () => {
    pawlog.info(`The app is listening at http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.log(err);
  });
app.post(
  "/votebot",
  webhook.listener(async (vote) => {
    const embed = {
      title: "Vote",
      description: `> <@${vote.user}> has voted for <@${vote.bot}>! \n Thank you for voting! \n You can vote again in 12 hours! \n \n [Vote for R6 Roulette](https://top.gg/bot/1129760031542358158/vote)`,
      color: convertHexToInt(getRandomColor().hex),
      timestamp: new Date(),
    };
    const data = {
      embeds: [embed],
    };

    axios
      .post(webhookURL, data)
      .then((response) => {})
      .catch((error) => {
        console.error("Fehler beim Senden des Embeds:", error);
      });
  }),
);

app.get("/alive", (req, res) => {
  res.send("YesSir!");
});
