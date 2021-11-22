const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('channel')
 .setDescription('add channel to RP-Channel list')
 .addStringOption(option =>
  option.setName('action')
  .setDescription('what to do')
  .setRequired(true)
  .addChoice('new', 'n')
  .addChoice('del', 'd'))
 .addChannelOption(option =>
  option.setName('channel')
  .setDescription('channel to use')
  .setRequired(true)),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);
  switch (interaction.options.getString('action')) {
   case  'n':
    db.newChannel(server, interaction.options.getChannel('channel'));
    interaction.reply('<#' + interaction.options.getChannel('channel').id + '> wurde hinzugefügt');
    break;
   case  'd':
    db.delChannel(server, interaction.options.getChannel('channel'));
    interaction.reply('<#' + interaction.options.getChannel('channel') + '> wurde gelöscht');
    break;
  }
 }
};