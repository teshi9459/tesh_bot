const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
const tk = require('../libs/ticket');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('ticket')
 .setDescription('Ticket System Einstellungen')
 .addSubcommand(subcommand =>
  subcommand
  .setName('new')
  .setDescription('erstellt ein neues Pannel')
  .addStringOption(option => option.setName('typ').setDescription('typ des pannels').setRequired(true).addChoice('Support', 'support').addChoice('Steckbrief', 'char').addChoice('Bewerbung', 'team'))
  .addStringOption(option => option.setName('info').setDescription('info auf dem Pannel').setRequired(true))
  .addChannelOption(option => option.setName('kategorie').setDescription('Kategorie in die neue Tickets verschoben werden').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('setup')
  .setDescription('erstellt das Ticket System'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('delete')
  .setDescription('löscht Pannel')),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);
  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
   });
   return;
  }
  switch (interaction.options.getSubcommand()) {
   case 'new':
    tk.newPannel(interaction);
    break;
   case 'setup':
    tk.setup(interaction);
    break;
   case 'delete':
    tk.deletePannel(interaction);
    break;
  }
 },
};