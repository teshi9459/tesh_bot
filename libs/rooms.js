const db = require('../libs/db');
const tools = require('../libs/tools');
const dc = require('../libs/dc');
const {
 MessageEmbed
} = require('discord.js');
const fs = require('fs');
module.exports = {
 data: {
  id: 'rooms',
  setup: false,
  ongoing: true
 },
 clear: function (interaction) {
  const server = db.getServer(interaction.guildId);

  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: `nur <@&${server.adminrole}> können das machen, melde dein char erst ab!`, ephemeral: true
   });
   return;
  }

  let Group = tools.getJ(`./DB/${interaction.guildId}/rooms/${interaction.options.getInteger('group')}.json`);
  let room;
  for (let i = 0; i < Group.rooms.length; i++) {
   if (Group.rooms[i].index == interaction.options.getInteger('room')) {
    room = i;
    break;
   }
  }

  const num = interaction.options.getInteger('bed')-1;

  Group.rooms[room].beds[num] = this.newBed();

  tools.setJ(`./DB/${interaction.guildId}/rooms/${interaction.options.getInteger('group')}.json`, Group);
  const channel = interaction.guild.channels.cache.find(c => c.id == Group.channel);
  channel.messages.fetch(Group.message).then(msg => msg.edit({
   embeds: [this.getEmbed(Group, interaction)]})).catch(e => console.error(e));
  interaction.reply({
   content: 'char wurde ausgetragen', ephemeral: true
  });
 },
 claim: function (interaction) {
  let Group = tools.getJ(`./DB/${interaction.guildId}/rooms/${interaction.options.getInteger('group')}.json`);
  let room;
  for (let i = 0; i < Group.rooms.length; i++) {
   if (Group.rooms[i].index == interaction.options.getInteger('room')) {
    room = i;
    break;
   }
  }

  let beds = Group.rooms[room].beds;
  let num;
  for (let i = 0; i <= beds.length; i++) {
   num = i;
   if (i >= Group.rooms[room].max) {
    interaction.reply({
     content: 'kein Platz frei :c', ephemeral: true
    });
    return;
   } else {
    if (beds[i].user == undefined)
     break;
   }
  }
  const server = db.getServer(interaction.guildId);

  if (interaction.options.getUser('user') !== null) {
   if (interaction.options.getUser('user').id != interaction.member.id && !interaction.member.roles.cache.has(server.adminrole)) {
    interaction.reply({
     content: 'du kannst das nicht machen :c', ephemeral: true
    });
    return;
   }}

  let bed = this.newBed();
  if (interaction.options.getUser('user') === null)
   bed.user = interaction.member.id;
  else
   bed.user = interaction.options.getUser('user').id;
  bed.channel = interaction.options.getChannel('characterchannel').id;
  bed.character = interaction.options.getString('character');

  Group.rooms[room].beds[num] = bed;
  tools.setJ(`./DB/${interaction.guildId}/rooms/${interaction.options.getInteger('group')}.json`, Group);
  const channel = interaction.guild.channels.cache.find(c => c.id == Group.channel);
  channel.messages.fetch(Group.message).then(msg => msg.edit({
   embeds: [this.getEmbed(Group, interaction)]}));
  interaction.reply({
   content: 'char wurde eingetragen', ephemeral: true
  });
 },
 newPannel: function (interaction) {
  const server = db.getServer(interaction.guildId);

  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: 'du kannst das nicht machen :c', ephemeral: true
   });
   return;
  }
  let old = this.newGroup(interaction);
  interaction.channel.send('bitte warten').then(msg => {
   let Group = tools.getJ(`./DB/${interaction.guildId}/rooms/${old.index}.json`);
   Group.message = msg.id;
   tools.setJ(`./DB/${interaction.guildId}/rooms/${old.index}.json`, Group);
   msg.edit({
    content: ' ',
    embeds: [this.getEmbed(Group, interaction)]});
   interaction.reply('>>> Trage dich einfach ein indem du `/rooms claim` benutzt. Oder lass dich austragen von einem Admin (nur wenn der Char auszieht oder in Sonderfällen)');
  }).catch(e => console.error(e));

 },
 getEmbed: function(Group, interaction) {
  let Embed = new MessageEmbed()
  .setColor('#b8f1ff')
  .setTitle(Group.name + ` [${Group.index}]`)
  .setFooter(`${interaction.guild.name} | ${interaction.client.user.username}-Bot`, interaction.guild.iconURL());
  for (var i = 0; i < Group.rooms.length; i++) {
   Embed.addField(`‹– Zimmer [${Group.rooms[i].index}] –›`, this.getRoom(Group.rooms[i].beds));
  }
  return Embed;
 },
 newGroup: function (interaction) {
  let numStart = interaction.options.getInteger('start');
  if (!fs.existsSync(`./DB/${interaction.guildId}/rooms/`)) {
   fs.mkdirSync(`./DB/${interaction.guildId}/rooms/`);
  }
  let num = 1;
  const commandFiles = fs.readdirSync(`./DB/${interaction.guildId}/rooms/`).filter(file => file.endsWith('.json'));
  for (const file of commandFiles) {
   num++;
  }

  let nRooms = [];
  for (let i = 0; i < interaction.options.getInteger('rooms'); i++) {
   let nBeds = [];
   for (var j = 0; j < interaction.options.getInteger('beds'); j++) {
    const bed = this.newBed();
    nBeds.push(bed);
   }
   const room = this.newRoom(i+numStart, interaction.options.getInteger('beds'), nBeds);
   nRooms.push(room);
  }
  let Group = {
   name: interaction.options.getString('name'),
   index: num,
   channel: interaction.channel.id,
   message: undefined,
   bedsAmount: interaction.options.getInteger('beds'),
   roomsAmount: interaction.options.getInteger('rooms'),
   roomsStart: interaction.options.getInteger('start'),
   rooms: nRooms,
  };
  tools.setJ(`./DB/${interaction.guildId}/rooms/${num}.json`, Group);
  return Group;
 },
 newRoom: function (num, maxBeds, allBeds) {
  const Room = {
   index: num,
   max: maxBeds,
   beds: allBeds,

  };
  return Room;
 },
 newBed: function (userId, char, channelId) {
  const Bed = {
   user: userId,
   character: char,
   channel: channelId,
  };
  return Bed;
 },
 getRoom: function (beds) {
  let out = '';
  for (let i = 0; i < beds.length; i++) {
   if (beds[i].user == undefined)
    out += `— \n`;
   else
    out += `— <@${beds[i].user}> · <#${beds[i].channel}> · ${beds[i].character}\n`;
  }
  return out;
 },
 delete: function (interaction, index) {
  const server = db.getServer(interaction.guildId);

  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: 'du kannst das nicht machen :c', ephemeral: true
   });
   return;
  }

  const Group = tools.getJ(`./DB/${interaction.guildId}/rooms/${index}.json`);
  tools.delPath(`./DB/${interaction.guildId}/rooms/${index}.json`);
  const channel = interaction.guild.channels.cache.find(c => c.id == Group.channel);
  channel.messages.fetch(Group.message).then(msg => msg.delete());
  interaction.reply({
   content: 'Gruppe ' + index +' wurde gelöscht', ephemeral: true
  });
 }
};