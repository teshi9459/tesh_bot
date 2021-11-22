const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('del')
 .setDescription('delete X messages')
 .addIntegerOption(option =>
  option.setName('x')
  .setDescription('indicates how many messages will be deleted ')
  .setRequired(true)),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);
  if (!interaction.member.roles.cache.has(server.adminrole)) return;
  const amount = interaction.options.getInteger('x');

  if (amount <= 1 || amount > 100) {
   interaction.reply('pls chose Number from 1 to 100');
   setTimeout(function() {
    interaction.deleteReply();
   }, 3000);
   return;
  }

  interaction.channel.bulkDelete(amount, true).catch(err => {
   console.error(err);
   interaction.reply('Cannot delete ${amount} messages');
   setTimeout(function() {
    interaction.deleteReply();
   }, 3000);
   return;
  });
  interaction.reply('done');
  setTimeout(function() {
   interaction.deleteReply();
  }, 3000);
 },
};