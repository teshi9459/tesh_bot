const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../../libs/db');
const dc = require('../../libs/dc');
const shorts = require('../../exports/slash/shorts');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('words')
 .setDescription('Einstellungen für words')
 .addSubcommand(subcommand =>
  subcommand
  .setName('max')
  .setDescription('Anzahl an Wörten die mindestens erreicht werden müssen')
  .addIntegerOption(option => option.setName('amount').setDescription('Zahl min 1').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('min')
  .setDescription('Anzahl an Wörtern ab denen das Modul startet').addIntegerOption(option => option.setName('amount').setDescription('Zahl min 0').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('status')
  .setDescription('gibt die Moduldaten zurück'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('setup')
  .setDescription('erstellt das words Modul'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('power')
  .setDescription('schaltet das Modul ein oder aus')
  .addBooleanOption(option => option.setName('status').setDescription('an = true aus = false').setRequired(true))),
 async execute(client, interaction) {
  let server;
  let module;
  try {
   server = db.getServer(interaction.guildId);
  } catch (e) {
   console.error(e);
   interaction.reply('bitte starte zuerst `/setup`');
   return;
  }

  if (!interaction.member.roles.cache.has(server.adminrole)) return;
  try {
   module = db.getModuleS(server, 'words');
  } catch (e) {
   if (interaction.options.getSubcommand() != 'setup') {
    interaction.reply('bitte starte zuerst `/words setup`');
    return;
   }
  }

  let answer = `>>> ${interaction.options.getSubcommand()} ist jetzt \``;
  switch (interaction.options.getSubcommand()) {
   case 'max':
    module.max = interaction.options.getInteger('amount');
    answer += module.max + '`';
    break;
   case 'min':
    module.min = interaction.options.getInteger('amount');
    answer += module.min + '`';
    break;
   case 'text':
    module.txt = interaction.options.getString('text');
    answer += module.txt + '`';
    break;
   case 'deletetime':
    module.delTime = interaction.options.getInteger('time') * 1000;
    answer += module.delTime + '`';
    break;
   case 'reportlevel':
    module.max = interaction.options.getInteger('level');
    answer += module.reportLevel + '`';
    break;
   case 'status':
    answer = "__Module__:\n\`\`\`" + JSON.stringify(module) + '```';
    break;
   case 'setup':
    shorts.wordsSetup(interaction);
    return;

   case 'power':
    module.enabled = interaction.getBoolean('status');
    answer = 'Modul words ist nun `Aus`';
    if (interaction.getBoolean('status'))
     answer = 'Modul words ist nun `An`';
    break;
  }
  db.updateModuleS(server, module);
  interaction.reply(answer);
 },
};