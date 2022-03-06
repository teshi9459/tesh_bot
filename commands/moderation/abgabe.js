const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const abgabe = require('../../exports/slash/abgabe');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('abgabe')
 .setDescription('Abgabe von Charactern')
 .addSubcommand(subcommand =>
  subcommand
  .setName('reject')
  .setDescription('only Team - lehnt einen Character ab')
  .addStringOption(option => option.setName('grund').setDescription('Grund fürs ablehnen des Characters').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('accept')
  .setDescription('only Team - nimmt einen Character an'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('setup')
  .setDescription('erstellt das Modul')
  .addRoleOption(option => option.setName('abnehmer').setDescription('Rolle die benötigt wird um ein Character zu accepten oder abzulehnen').setRequired(true))
  .addRoleOption(option => option.setName('rper').setDescription('Rolle die benötigt wird um Rper zu sein').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('finish')
  .setDescription('beendet die Abgabe mit dem speichern einer Kurzfassung')
  .addStringOption(option => option.setName('steckbrief').setDescription('Die kurze Version vom Steckbrief bitte hier einfügen (max 4000 Zeichen)').setRequired(true))),
 async execute(client,
  interaction) {
  switch (interaction.options.getSubcommand()) {
   case 'reject':
    abgabe.reject(interaction);
    break;
   case 'accept':
    abgabe.accept(interaction);
    break;
   case 'setup':
    abgabe.setup(interaction);
    break;
   case 'finish':
    abgabe.finish(interaction);
    break;
  }
 },
};