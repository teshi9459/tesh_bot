const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('setup')
 .setDescription('setup den Bot für den Server')
 .addRoleOption(option =>
  option.setName('admin')
  .setDescription('Admin Rolle (kann Bot Einstellungen vornehmen)')
  .setRequired(true)),
 async execute(client, interaction) {
  try {
   if (db.getServer(interaction.guildId).setup) {
    interaction.reply('Kein setup nötig :)');
    return;
   }
  } catch (e) {}
  db.setServer(interaction.guild);
  let server = db.getServer(interaction.guildId);
  const role = interaction.options.getRole('admin');
  server.adminrole = role.id;
  interaction.guild.channels.create("Tesh Bot", {
   type: "GUILD_CATEGORY"
  }).then(category => {
   interaction.guild.channels.create("dev", {
    type: "GUILD_TEXT"
   }).then(channel => {
    channel.setParent(category);
    channel.permissionOverwrites.edit(interaction.guild.id, {
     VIEW_CHANNEL: false
    });
    channel.permissionOverwrites.edit(server.adminrole, {
     VIEW_CHANNEL: true
    });
    channel.permissionOverwrites.edit("652959577293324288", {
     VIEW_CHANNEL: true
    });
   });
   interaction.guild.channels.create("ideen bugs infos", {
    type: "GUILD_TEXT"
   }).then(channel => {
    channel.setParent(category);
    channel.send(`>>> **Ideen** einfach unten reinschreiben\n\nbei **Bugs** Nachricht schreiben, Thread erstellen und einmal <@!652959577293324288> pingen.`);
   });
   let sv = db.getServer(category.guildId);
   sv.category = category.id;
   db.updateServer(sv);
  });

  server.setup = true;

  server = db.updateServer(server);
  db.setChannels(server);
  interaction.reply('fertig mit setup :relieved:');
 },
};