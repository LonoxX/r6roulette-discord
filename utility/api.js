const {EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} = require("discord.js");
const client = require("../index.js")
const config = require("../config.json");	
const pawlog = require("./logs.js")
const { getRandomColor } = require("./colorlist.js");
const express = require('express')
const app = express()
const port = 3000
const Topgg = require('@top-gg/sdk');
const votechannel = '1170739392340574299'
const webhook = new Topgg.Webhook('vote')

app.listen(port, () => {
  pawlog.info(`The app is listening at http://localhost:${port}`)
}).on('error', err => {
  console.log(err)
})
    app.post( '/votebot',
        webhook.listener(async (vote) => {
          const channel = client.channels.cache.get(votechannel);
          if (!channel) return;
          const embed = new EmbedBuilder()
            .setTitle('Vote')
            .setColor(getRandomColor().hex)
            .setDescription(`> <@${vote.user}> has voted for <@${vote.bot}>! \n Thank you for voting!`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} `, iconURL: `${client.user.displayAvatarURL()}`, }); 

            const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel(`Vote for ${client.user.username}`)
                .setStyle(ButtonStyle.Link)
                .setURL(`https://top.gg/bot/${client.user.id}/vote`),
            ) 
          channel.send({ embeds: [embed] , components: [row] });   
        }),
    );


app.get('/alive', (req, res) => {
  res.send('YesSir!')
})