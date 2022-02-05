const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const charDb = require('../libs/charDb');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('char')
 .setDescription('Infos und bearbeiten von Charactern')
 .addSubcommand(subcommand =>
  subcommand
  .setName('info')
  .setDescription('zeigt infos über den Character wie der Steckbrief')
  .addIntegerOption(option => option.setName('id').setDescription('id des Characters (/char list)').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('nur wenn benutzt - User wessen Character angezeigt werden sollen')))
 .addSubcommand(subcommand =>
  subcommand
  .setName('list')
  .setDescription('listet alle Character von einem User auf')
  .addUserOption(option => option.setName('user').setDescription('User wessen Character angezeigt werden sollen'))),
 async execute(client, interaction) {
  switch (interaction.options.getSubcommand()) {
   case 'info':
    charDb.info(interaction);
    break;
   case 'list':
    charDb.list(interaction);
    break;
  }
 },
};