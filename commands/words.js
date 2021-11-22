const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('words')
 .setDescription('Settings for the words module')
 .addSubcommand(subcommand =>
  subcommand
  .setName('max')
  .setDescription('set the number of words that trigger a warning')
  .addIntegerOption(option => option.setName('amount').setDescription('Amount of max').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('min')
  .setDescription('sets the number of words that are ignored').addIntegerOption(option => option.setName('amount').setDescription('Amount of min (≥0)').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('text')
  .setDescription('sets the warning text').addStringOption(option => option.setName('text').setDescription('text that the bot say, if tge Module is trigered').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('deletetime')
  .setDescription('sets the time after which the warning is deleted').addIntegerOption(option => option.setName('time').setDescription('time in s').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('reportlevel')
  .setDescription('sets the level of the report').addIntegerOption(option => option.setName('level').setDescription('level for the report (0-5)').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('status')
  .setDescription('return the Module')),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);
  let module = db.getModuleS(server, 'words');
  let answer = `>>> ${interaction.options.getSubcommand()} is now \``;
  switch (interaction.options.getSubcommand()) {
   case 'max':
    module.max = interaction.options.getInteger('amount');
    answer += module.max;
    break;
   case 'min':
    module.min = interaction.options.getInteger('amount');
    answer += module.min;
    break;
   case 'text':
    module.txt = interaction.options.getString('text');
    answer += module.txt;
    break;
   case 'deletetime':
    module.delTime = interaction.options.getInteger('time')*1000;
    answer += module.delTime;
    break;
   case 'reportlevel':
    module.max = interaction.options.getInteger('level');
    answer += module.reportLevel;
    break;
   case 'status':
    answer = "__Module__:\n\`"+JSON.stringify(module);
    break;
  }
  db.updateModuleS(server, module);
  answer += '`';
  interaction.reply(answer);
 },
};