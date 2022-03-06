const t = require('../../libs/tools');
const db = require('../../libs/db');
const fs = require('fs');
const {
 MessageEmbed,
 MessageActionRow,
 MessageButton
} = require('discord.js');
module.exports = {
 list: function (interaction) {
  let user;
  let chars = [];
  if (interaction.options.getUser('user') == null) {
   user = interaction.user;
  } else {
   user = interaction.options.getUser('user');
  }

  let eph = false;
  const server = db.getServer(interaction.guildId);
  try {
   const channel = db.getChannels(server, true);
   for (let i = 0; i < channel.length; i++) {
    if (interaction.channel.parentId == channel[i]) {
     eph = true;
    }
   }
  } catch (e) {
   console.error(e);
  }

  const charfiles = fs.readdirSync(`./DB/${interaction.guildId}/user/${user.id}/character`).filter(file => file.endsWith('.json'));
  for (const file of charfiles) {
   const charF = t.getJ(`./DB/${interaction.guildId}/user/${user.id}/character/${file}`);
   chars.push(charF);
  }
  let Embed = new MessageEmbed()
  .setColor('#94eaff')
  .setTitle(user.username + 's Charcterlist')
  .setFooter(`${user.tag} hat ${chars.length} Charcter`, interaction.guild.iconURL());
  for (let i = 0; i < chars.length; i++) {
   Embed.addField(chars[i].name, 'Id: '+chars[i].id+'\nLevel: '+chars[i].level);
  }
  if (chars.length == 0) Embed.setDescription('keine Charcter');
  interaction.reply({
   embeds: [Embed], ephemeral: eph
  });
 },
 info: function (interaction) {
  const server = db.getServer(interaction.guildId);
  let user;
  let char;
  let eph = false;
  if (interaction.options.getUser('user') == null) {
   user = interaction.user;
  } else {
   user = interaction.options.getUser('user');
  }
  try {
   const channel = db.getChannels(server, true);
   for (let i = 0; i < channel.length; i++) {
    if (interaction.channel.parentId == channel[i]) {
     eph = true;
    }
   }
  } catch (e) {
   console.error(e);
  }
  const charfiles = fs.readdirSync(`./DB/${interaction.guildId}/user/${user.id}/character`).filter(file => file.endsWith('.json'));
  for (const file of charfiles) {
   const charF = t.getJ(`./DB/${interaction.guildId}/user/${user.id}/character/${file}`);
   if (charF.id == interaction.options.getInteger('id')) {
    char = charF;
    break;
   }
  }
  if (char === undefined) {
   interaction.reply({
    content: 'Charcter konnte nicht gefunden werden', ephemeral: true
   });
   return;
  }
  const d = new Date(char.time.accept);
  let Embed = new MessageEmbed()
  .setColor('#94eaff')
  .setTitle(char.name + ' Infos')
  .setDescription(char.text)
  .addField('Accepted von:', '<@!'+char.accepts[0] + '> & <@!' + char.accepts[1] + '>')
  .addField('Erstellt am:', ''+d.toLocaleString())
  .addField('Level:', ''+char.level)
  .addField('Prefix:', char.prefix)
  .setFooter(`${user.tag} | Charcter ${char.id}`, interaction.guild.iconURL());
  interaction.reply({
   embeds: [Embed], ephemeral: eph
  });
 }
};