const db = require('../libs/db');
const dc = require('../libs/dc');
const {
 MessageEmbed
} = require('discord.js');
module.exports = {
 data: {
  id: 'level',
  setup: true
 },
 start: function (msg) {
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
  let user = db.getUser(server, msg.author.id);
  if (user.levelPing === undefined) user.levelPing = true;
  if (user.xp === undefined) user.xp = 0;
  const count = msg.content.split(' ').length;
  const oldLevel = Math.floor(Math.sqrt(user.xp));
  if (count < module.min) user.xp++;
  else if (count >= module.min) user.xp += Math.round(count/module.unit);
  const newLevel = Math.floor(Math.sqrt(user.xp));
  if (newLevel > oldLevel) this.levelUp(msg, server, module, user, newLevel);
  else db.updateUser(server, user);
 },
 levelUp: function (msg, server, module, user, newLevel) {
  const nextXp = Math.pow(newLevel+1, 2);
  let ping = ['an',
   'on'];
  if (user.levelPing)  ping = ['aus',
   'off'];
  const userDc = dc.getMember(msg, user.id);
  let Embed = new MessageEmbed()
  .setTitle(`🎉__Congratulations ${msg.author.username}__🎉`)
  .setColor('#aaeeff')
  .setDescription(`Du hast **Level ${newLevel}** erreicht!\nFür Level ${newLevel+1} brauchst du **noch ${nextXp-user.xp} XP**\n*schalte den Ping mit \`level ping ${ping[1]}\` ${ping[0]}*`)
  .setFooter(`Level ${newLevel} - XP ${user.xp} | Tesh-Level-System`, msg.guild.iconURL());
  for (let i = 0; i < module.level.length; i++) {
   if (module.level[i].index == newLevel) {
    Embed
    .setColor('#a3ff8a')
    .setDescription(module.level[i].text);
    msg.member.roles.add(module.level[i].role);
   //remove old
    break;
   }
  }
  db.updateUser(server, user);
  const channel = dc.getChannel(msg, module.log);
  if (user.levelPing) {
   channel.send({
    content: `<@!${user.id}>`,
    embeds: [Embed]
   });
  } else {
   channel.send({
    embeds: [Embed]
   });
  }
 },
 setup: function (interaction, server) {
  let module = {
   id: 'level',
   enabled: false
  };
  module.min = 20;
  module.unit = 15;
  module.level = [{
   index: 0,
   text: 'neues Level!',
   role: null
  }];
  interaction.guild.channels.create("level",
   {
    type: "GUILD_TEXT"
   }).then(channel => {
    channel.setParent(server.category);
    module.log = channel.id;
    db.setModuleS(server, module);
   });
  interaction.reply({
   content: 'fertig :)', ephemeral: true
  });
 }
};