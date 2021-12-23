const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
const dc = require('../libs/dc');
const shorts = require('../libs/shorts');
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
  .setDescription('return the Module'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('setup')
  .setDescription('setup the words module'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('on')
  .setDescription('turns on the words module'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('off')
  .setDescription('turns off the words module')),
 async execute(client, interaction) {
  let server;
  let module;
  try {
   server = db.getServer(interaction.guildId);
  } catch (e) {
   console.error(e);
   interaction.reply('bite starte zuerst setup');
   return;
  }
  try {
   module = db.getModuleS(server, 'words');
  } catch (e) {
   if (interaction.options.getSubcommand() != 'setup') {
    interaction.reply('bitte führe zuerst words setup aus!');
    return;
   }
  }

  let answer = `>>> ${interaction.options.getSubcommand()} is now \``;
  switch (interaction.options.getSubcommand()) {
   case 'max':
    module.max = interaction.options.getInteger('amount');
    answer += module.max+ '`';
    break;
   case 'min':
    module.min = interaction.options.getInteger('amount');
    answer += module.min+ '`';
    break;
   case 'text':
    module.txt = interaction.options.getString('text');
    answer += module.txt+ '`';
    break;
   case 'deletetime':
    module.delTime = interaction.options.getInteger('time')*1000;
    answer += module.delTime+ '`';
    break;
   case 'reportlevel':
    module.max = interaction.options.getInteger('level');
    answer += module.reportLevel+ '`';
    break;
   case 'status':
    answer = "__Module__:\n\`\`\`"+JSON.stringify(module)+ '```';
    break;
   case 'setup':
    shorts.wordsSetup(interaction);
    return;

    case 'on':
     module.enabled = true;
     answer = 'Modul words ist nun `on`';
     break;
    case 'off':
     module.enabled = false;
     answer = 'Modul words ist nun `off`';
     break;
  }
  db.updateModuleS(server, module);
  interaction.reply(answer);
 },
};