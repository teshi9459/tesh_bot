const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('channel')
 .setDescription('ändert die RP Channel des Servers')
 .addSubcommand(subcommand =>
  subcommand
  .setName('add')
  .setDescription('fügt einen Channel zur Liste hinzu')
  .addChannelOption(option => option.setName('channel').setDescription('die KATEGORIE welche hinzugefügt werden soll').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('del')
  .setDescription('löscht Channel aus der liste')
  .addChannelOption(option => option.setName('channel').setDescription('die KATEGORIE welche hinzugefügt werden soll').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('list')
  .setDescription('zeigt alle aufgenommenen Channel')),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);
  const rp = db.getChannels(server);
  switch (interaction.options.getSubcommand()) {
   case 'add':
    for (let i = 0; i < rp.length; i++) {
     if (rp[i] == interaction.options.getChannel('channel')) {
      interaction.reply("<#"+interaction.options.getChannel('channel').id+"> ist schon aufgenommen");
      return;
     }
    }
    db.newChannel(server, interaction.options.getChannel('channel'));
    interaction.reply('<#' + interaction.options.getChannel('channel').id + '> wurde hinzugefügt');
    break;
   case 'del':
    for (let i = 0; i < rp.length; i++) {
     if (rp[i] == interaction.options.getChannel('channel')) {
      db.delChannel(server, interaction.options.getChannel('channel'));
      interaction.reply('<#' + interaction.options.getChannel('channel') + '> wurde gelöscht');
      return;
     }}
    interaction.reply("<#"+interaction.options.getChannel('channel')+"> nicht gefunden");
    break;
   case 'list':
    let list = `>>> __Roleplay Kategorien__`;
    for (let i = 0; i < rp.length; i++) {
     list += `\n${i+1}. <#${rp[i]}>`;
    }
    list += `\n<------------------>`;
    interaction.reply(list);
    break;
  }
 }
};