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
  const channels = db.getChannels(server);
  switch (interaction.options.getString('action')) {
   case  'n':
    for (let i = 0; i < channels.length; i++) {
     if (channels[i] == interaction.options.getChannel('channel')) {
      interaction.reply("<#"+interaction.options.getChannel('channel').id+"> ist schon aufgenommen");
      return;
     }
    }
    db.newChannel(server, interaction.options.getChannel('channel'));
    interaction.reply('<#' + interaction.options.getChannel('channel').id + '> wurde hinzugefügt');
    break;
   case  'd':
    for (let i = 0; i < channels.length; i++) {
     if (channels[i] == interaction.options.getChannel('channel')) {
      const one = true;
     }
     if (!one) {
      interaction.reply("<#"+interaction.options.getChannel('channel').id+"> nicht gefunden");
      return;
     }

    }
    db.delChannel(server, interaction.options.getChannel('channel'));
    interaction.reply('<#' + interaction.options.getChannel('channel') + '> wurde gelöscht');
    break;
  }
 }
};