const db = require('../libs/db');
const t = require('../libs/tools');
const {
 MessageEmbed
} = require('discord.js');
module.exports = {
 data: {
  id: 'stats',
  setup: true
 },
 start: function (msg) {
  if (msg.author.bot) return;
  if (msg.content.includes(')') || msg.content.includes('(')) retrun;
  console.log('lol')
  try {
   const server = db.getServer(msg.guildId);
   const channel = db.getChannels(server);
   let module = db.getModuleS(server, 'level');
   let rpchannel = false;
   for (let i = 0; i < channel.length; i++) {
    if (msg.channel.parentId == channel[i]) {
     rpchannel = true;
     break;
    }
   }
   if (module.enabled && rpchannel)
    this.main(msg, server, module);
  } catch (e) {
   console.error(e);
  }
 },
 main: function (msg, server, module) {
  let user;
  let stats = t.getJ(`./DB/${server.id}/stats.json`);
  try {
   user = db.getUser(server, msg.author.id);
  } catch (e) {
   db.setUser(server, msg.author);
   user = db.getUser(server, msg.author.id);
  }
  function saveMsg (stats, msg, server, module) {
   for (let i = 0; i < stats.channel.length; i++) {
    if (msg.channel.id == stats.channel[i][0]) {
     stats.channel[i] == this.newMsg(stats.channel[i], msg);
     t.setJ(`./DB/${server.id}/stats.json`, stats);
     this.updateInfo(msg, server, module);
     return;
    }
   }}
  saveMsg(stats, msg, server, module);
  const now = new Date(msg.createdTimestamp
  );
  // year,month,day,hour,msg
  stats.channel.push([msg.channel.id, []]);
  saveMsg(stats, msg, server, module);
 },
 updateInfo: function (msg, server, module) {
  let stats = t.getJ(`./DB/${server.id}/stats.json`);
  const stY = this.getInfos(stats, 'year');
  let stYear = 'In diesem Jahr wurden **' + stY[0] + ' Nachrichten** Rped. Es waren **' + stY[1] + ' RPer** daran beteiligt. Eine durechschnittliche Nachrichten hatte **'+ stY[2] + ' Wörter** und war **'+ stY[3] + ' Zeichen** lang.';
  const stM = this.getInfos(stats, 'month');
  let stMonth = 'In diesem Monat wurden **' + stM[0] + ' Nachrichten** Rped. Es waren **' + stM[1] + ' RPer** daran beteiligt. Eine durechschnittliche Nachrichten hatte **'+ stM[2] + ' Wörter** und war **'+ stM[3] + ' Zeichen** lang.';
  const stD = this.getInfos(stats, 'day');
  let stDay = 'An diesem Tag wurden **' + stD[0] + ' Nachrichten** Rped. Es waren **' + stD[1] + ' RPer** daran beteiligt. Eine durechschnittliche Nachrichten hatte **'+ stD[2] + ' Wörter** und war **'+ stD[3] + ' Zeichen** lang.';

  const Embed = new MessageEmbed()
  .setColor('#aaeeff')
  .setTitle(`__${msg.guild.name} Roleplay Infos__`)
  .setURL('http://teshi.vastserve.com')
  .setDescription(text)
  .addFields(
   {
    name: 'Stats für heute: '+ t.getTimeV('day', msg.createdTimestamp), value: stDay, inline: true
   },
   {
    name: 'Stats für diesen Monat: '+ t.getTimeV('month', msg.createdTimestamp), value: stMonth, inline: true
   },
   {
    name: 'Stats für dieses Jahr: '+ t.getTimeV('year', msg.createdTimestamp), value: stYear, inline: true
   },
  )
  .setThumbnail(msg.guild.iconURL())
  .setTimestamp()
  .setFooter(`${msg.guild.name} - Tesh Analytics`, msg.guild.iconURL());
  const channel = interaction.guild.channels.cache.find(c => c.id == module.channel);
  channel.messages.fetch(module.message).then(msg => msg.edit({
   content: 'uwu',
   embeds: [Embed]})).catch(e => console.error(e));
 },
 getInfos: function (stats, typ) {
  let messages = [];
  const now = new Date();
  switch (typ) {
   case 'year':
    for (let y = 0; y < stats.channel.length; y++) {
     const channel = stats.channel[y][1];
     for (let a = 0; a < channel[1].length; a++) {
      if (channel[1][a][0] === t.getTimeV('year', now)) {
       for (let b = 0; b < channel[1][a].length; b++) {
        for (let c = 0; c < channel[1][a][b].length; c++) {
         for (let d = 0; d < channel[1][a][b][c].length; d++) {
          messages.push(channel[1][a][b][c][d][1]);
         }
        }
       }
       break;
      }
     }
    }
    break;
   case 'month':
    for (let y = 0; y < stats.channel.length; y++) {
     const channel = stats.channel[y][1];
     for (let a = 0; a < channel[1].length; a++) {
      if (channel[1][a][0] === t.getTimeV('year', now)) {
       for (let b = 0; b < channel[1][a].length; b++) {
        if (channel[1][a][b][0] === t.getTimeV('month', now)) {
         for (let c = 0; c < channel[1][a][b].length; c++) {
          for (let d = 0; d < channel[1][a][b][c].length; d++) {
           messages.push(channel[1][a][b][c][d][1]);
          }
         }
         break;
        }
       }
       break;
      }
     }
    }
    break;
   case 'day':
    for (let y = 0; y < stats.channel.length; y++) {
     const channel = stats.channel[y][1];
     for (let a = 0; a < channel[1].length; a++) {
      if (channel[1][a][0] === t.getTimeV('year', now)) {
       for (let b = 0; b < channel[1][a].length; b++) {
        if (channel[1][a][b][0] === t.getTimeV('month', now)) {
         for (let c = 0; c < channel[1][a][b].length; c++) {
          if (channel[1][a][b][0] === t.getTimeV('month', now)) {
           for (let d = 0; d < channel[1][a][b][c].length; d++) {
            messages.push(channel[1][a][b][c][d][1]);
           }
           break;
          }
         }
         break;
        }
       }
       break;
      }
     }
    }
    break;
   default:
    return undefined;
   }
   let out = [0,
    0,
    0,
    0];
   let user;
   for (var i = 0; i < messages.length; i++) {
    out[0]++;
    let us = true;
    for (let j = 0; j < user.length; j++) {
     if (messages[i].user == user[j]) {
      us = false;
      break;
     }
    }
    if (us) {
     us.push(messages[i].user);
     out[1]++;
    }
    out[2] += messages[i].length.words;
    out[3] += messages[i].length.chars;
   }
   out[1] = user.length;
   out[2] = out[2]/i;
   out[3] = out[3]/i;
   return out;
  },
  newMsg: function (channel, msg) {
   const now = new Date(msg.createdTimestamp
   );
   for (var a = 0; a < channel.length; a++) {
    if (channel[a][0] === t.getTimeV('year', now)) {
     for (var b = 0; b < channel[a][1].length; b++) {
      if (channel[a][1][b][0] === t.getTimeV('month', now)) {
       for (var c = 0; c < channel[a][1][b][1].length; c++) {
        if (channel[a][1][b][1][c][0] === t.getTimeV('day', now)) {
         for (var d = 0; d < channel[a][1][b][1][c][1].length; d++) {
          if (channel[a][1][b][1][c][1][d][0] === t.getTimeV('hours', now)) {
           channel[a][1][b][1][c][1][d][1].push({
            id: msg.id,
            length: {
             words: msg.content.split(' ').length, chars: msg.content.length
            },
            user: msg.author.id,
            time: msg.createdTimestamp
           });
           return channel;
          }
         }
         channel[a][1][b][1][c][1].push([t.getTimeV('hours', now), []]);
         return this.newMsg(channel, msg);
        }
       }
       channel[a][1][b][1].push([t.getTimeV('day', now), []]);
       return this.newMsg(channel, msg);
      }
     }
     channel[a][1].push([t.getTimeV('month', now), []]);
     return this.newMsg(channel, msg);
    }
   }
   channel.push([t.getTimeV('year', now), []]);
   return this.newMsg(channel, msg);
  },
  setup: function (interaction) {
   let module = {
    id: 'stats',
    enabled: true
   };
   const server = db.getServer(interaction.guildId);
   interaction.guild.channels.create("dashboardkrams",
    {
     type: "GUILD_TEXT"
    }).then(channel => {
     channel.setParent(server.category);
     module.channel = channel.id;
     channel.send('msg').then(msg => {
      module.message = msg.id;
      db.setModuleS(server, module);
     });
    });
   t.setJ(`./DB/${interaction.guildId}/stats.json`, {
    server: {}, channel: []});
   interaction.reply({
    content: 'fertig :)', ephemeral: true
   });
  }
 };