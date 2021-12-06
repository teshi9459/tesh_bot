const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('channel')
 .setDescription('add channel to RP-Channel list')
 .addSubcommand(subcommand =>
  subcommand
  .setName('add')
  .setDescription('add channel to list')
  .addChannelOption(option => option.setName('channel').setDescription('the CATEGORY to add').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('del')
  .setDescription('delete Channel from list')
  .addChannelOption(option => option.setName('channel').setDescription('the CATEGORY to delete').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('list')
  .setDescription('send a message with all channels')),
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