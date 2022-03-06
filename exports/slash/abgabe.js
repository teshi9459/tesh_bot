const db = require('../../libs/db');
const tools = require('../../libs/tools');
const dc = require('../../libs/dc');
const sthp = require('../../libs/stringhelp');
const {
 MessageEmbed,
 MessageActionRow,
 MessageButton
} = require('discord.js');
const fs = require('fs');
module.exports = {
 data: {
  id: 'abgabe',
  setup: true,
  ongoing: true
 },
 setup: function (interaction) {
  const server = db.getServer(interaction.guildId);
  let modul = {
   id: 'abgabe',
   rper: interaction.options.getRole('rper').id,
   team: interaction.options.getRole('abnehmer').id
  };
  db.setModuleS(server, modul);
  interaction.reply({
   content: 'es wurde alles für abgabe vorbereitet :)',
   ephemeral: true
  });
 },
 getEmbed: function (char, interaction) {
  let team = '';
  let color = '';
  if (char.team[0] == undefined) {
   team = 'noch keinen';
   color = '#adefff';
  } else {
   for (let i = 0; i < char.team.length; i++) {
    if (i == 0) {
     team += '<@!'+char.team[i]+'>';
    } else {
     team += ' & <@!'+char.team[i]+'>';
    }
   }
   color = '#38ff8a';
  }
  let Embed = new MessageEmbed()
  .setColor(color)
  .setTitle(char.name)
  .setDescription('Aktuelle Bearbeiter: '+team+'\n**Accepts:** '+accs)
  .setFooter(`${char.usertag} | ${char.id}. Charcter`, interaction.guild.iconURL());
  return {
   content: 'Character Info',
   embeds: [Embed]};
 },
 accept: async function (interaction) {
  const server = db.getServer(interaction.guildId);
  const modul = db.getModuleS(server, 'abgabe');
  if (!interaction.member.roles.cache.has(modul.team)) {
   interaction.reply({
    content: `nur <@&${modul.team}> können das machen`, ephemeral: true
   });
   return;
  }
  let char = tools.getJ(`./DB/${interaction.guildId}/tickets/${interaction.channel.id}.json`);
  if (char.accepts[0] == interaction.user.id) {
   interaction.reply({
    content: `du hast diesen Character bereits accepted`, ephemeral: true
   });
   return;
  }
  if (char.accepts.length == 2) {
   interaction.reply({
    content: 'dieser Character ist bereits accepted', ephemeral: true
   });
   return;
  }
  if (char.accepts[0] == undefined) {
   char.accepts.push(interaction.user.id);
   let Embed = new MessageEmbed()
   .setColor('#abeeff')
   .setTitle('Accepted 1/2')
   .setDescription('Der Charcter wurde von <@!'+ interaction.user.id +'> accepted.\n Warte nun auf einen weiteren Accept.')
   .setFooter(`${interaction.user.tag} hat den Character accepted`, interaction.guild.iconURL());
   tools.setJ(`./DB/${interaction.guildId}/tickets/${interaction.channel.id }.json`, char);
   await interaction.reply({
    embeds: [Embed]});
  } else {
   char.accepts.push(interaction.user.id);
   let Embed = new MessageEmbed()
   .setColor('#abeeff')
   .setTitle('Accepted 2/2')
   .setDescription(`Der Charcter wurde nun auch von <@!${interaction.user.id}> accepted. Glückwunsch!\n\n__Fertig?__ Schicke bitte deine Steckbrief noch mal \`so\` herein.\nDas machst du mit einem \` vor deinem Steckbrief und einem danach.`)
   .setFooter(`${
    interaction.user.tag
    } hat den Character accepted`, interaction.guild.iconURL());
   tools.setJ(`./DB/${
    interaction.guildId
    }/tickets/${
    interaction.channel.id
    }.json`, char);
   await interaction.reply({
    embeds: [Embed]});
  }
 },
 reject: function (interaction) {
  const server = db.getServer(interaction.guildId);
  const modul = db.getModuleS(server, 'abgabe');
  let char = tools.getJ(`./DB/${
   interaction.guildId
   }/tickets/${
   interaction.channel.id
   }.json`);
  if (!interaction.member.roles.cache.has(modul.team)) {
   interaction.reply({
    content: `nur < @&${
    modul.team
    } > können das machen`, ephemeral: true
   });
   return;
  }
  let Embed = new MessageEmbed()
  .setColor('#a42626')
  .setTitle('rejected - abgelehnt')
  .setDescription('Der Charcter wurde von <@!'+ interaction.user.id +'> rejected.\nGrund:\n'+interaction.options.getString('grund')+'\nWenn du auf `close` drückst wird das Ticket geschlossen')
  .setFooter(`${interaction.user.tag} hat den Charakter abgelehnt`, interaction.guild.iconURL());

  const row = new MessageActionRow()
  .addComponents(
   new MessageButton()
   .setCustomId(`ticket_close@${
    interaction.channel.id
    }`)
   .setLabel('close')
   .setStyle('DANGER'));
  interaction.reply({
   embeds: [Embed],
   components: [row]});
 },
 finish: function (interaction) {
  const server = db.getServer(interaction.guildId);
  const modul = db.getModuleS(server,
   'abgabe');
  let char = tools.getJ(`./DB/${
   interaction.guildId
   }/tickets/${
   interaction.channel.id
   }.json`);
  if (char.accepts.length != 2) {
   interaction.reply({
    content: `du brauchst erst 2 accepts`, ephemeral: true
   });
   return;
  }
  const row = new MessageActionRow()
  .addComponents(
   new MessageButton()
   .setCustomId(`yes_finish_abgabe@${
    interaction.channel.id
    }`)
   .setLabel('Ja')
   .setStyle('SUCCESS'),
   new MessageButton()
   .setCustomId(`no_finish_abgabe@${
    interaction.channel.id
    }`)
   .setLabel('Nein')
   .setStyle('DANGER'));
  char.text = interaction.options.getString('steckbrief');

  let Embed = new MessageEmbed()
  .setColor('#aeefff')
  .setTitle('Überprüfung')
  .setDescription(char.text)
  .addFields(
   {
    name: 'Name', value: sthp.getShorts('name', char.text)
   },
   {
    name: 'Alter', value: sthp.getShorts('age', char.text)
   },
   {
    name: 'Gilde', value: sthp.getShorts('gilde', char.text)
   },
  )
  .setFooter(`${
   interaction.user.tag
   }`, interaction.guild.iconURL());
  interaction.reply({
   content: '>>> Sind diese Angaben richtig? (du kannst sie nur mit einer erneuten Abgabe oder durch einen Admin ändern!)', embeds: [Embed],
   components: [row]});
  const filter = i => i.customId === `yes_finish_abgabe@${
  interaction.channel.id
  }` && i.user.id == char.user || i.customId === `no_finish_abgabe@${
  interaction.channel.id
  }` && i.user.id == char.user;

  const collector = interaction.channel.createMessageComponentCollector({
   filter,
   time: 30*1000
  });

  collector.on('collect',
   async i => {
    if (i.customId === `no_finish_abgabe@${
     interaction.channel.id
     }`) {
     i.update({
      content: 'gebe den Command bitte erneut mit dem richtigen Steckbrief ein', embeds: [], components: []});
    } else if (i.customId === `yes_finish_abgabe@${
     interaction.channel.id
     }`) {
     let num = 1;
     try {
      const chars = fs.readdirSync(`./DB/${
       server.id
       }/user/${
       ticket.user
       }/charcter/`).filter(file => file.endsWith('.json'));
      for (const file of chars) {
       num++;
      }
     } catch (e) {}


     const character = {
      id: num,
      name: sthp.getShorts('name', char.text),
      age: sthp.getShorts('age', char.text),
      gilde: sthp.getShorts('gilde', char.text),
      rang: sthp.getShorts('rang', char.text),
      text: interaction.options.getString('steckbrief'),
      level: 0,
      xp: 0,
      messages: 0,
      user: char.user,
      accepts: char.accepts,
      items: [],
      time: {
       accept: new Date().getTime()
      }
     };
     tools.setJ(`./DB/${
      interaction.guildId
      }/user/${
      character.user
      }/character/${
      character.id
      }.json`, character);
     i.member.roles.add(modul.rper);
     i.update({
      content: `Der Character \`${character.name}\` wurde Gespeichert!\n**FERTIG** den Rest übernimmt das Team`, embeds: [], components: []});
    }
   });

  collector.on('end',
   c => {});
 }
};