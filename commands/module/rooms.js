const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../../libs/db');
const dc = require('../../libs/dc');
const rooms = require('../../exports/slash/rooms');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('rooms')
 .setDescription('Einstellungen für rooms')
 .addSubcommand(subcommand =>
  subcommand
  .setName('new')
  .setDescription('erstellt eine neue Gruppe an Räumen')
  .addStringOption(option => option.setName('name').setDescription('Name der Gruppe').setRequired(true))
  .addIntegerOption(option => option.setName('rooms').setDescription('Wie viele Räume in der Gruppe sein sollen 1-25').setRequired(true))
  .addIntegerOption(option => option.setName('beds').setDescription('Wie viele Betten in einem Raum sein sollen 1-10').setRequired(true))
  .addIntegerOption(option => option.setName('start').setDescription('bei welcher Nummer die Räume anfangen sollen min 1').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('claim')
  .setDescription('claimt ein Bett in einem Raum')
  .addIntegerOption(option => option.setName('group').setDescription('die Gruppe steht in [] ganz am Anfang').setRequired(true))
  .addIntegerOption(option => option.setName('room').setDescription('die Nummer des Raums in den du willst steht in [] daneben').setRequired(true))
  .addChannelOption(option => option.setName('characterchannel').setDescription('wähle deinen Character-Channel').setRequired(true))
  .addStringOption(option => option.setName('character').setDescription('Name des Characters').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('nur für Admin wenn sie jemanden zuteilen')))
 .addSubcommand(subcommand =>
  subcommand
  .setName('delete')
  .setDescription('Löscht eine Gruppe von Räumen')
  .addIntegerOption(option => option.setName('group').setDescription('Gruppe die zu löschen ist [?]').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('clear')
  .setDescription('löscht einen Character aus einem Bett').addIntegerOption(option => option.setName('group').setDescription('die Gruppe steht in [] ganz Oben').setRequired(true))
  .addIntegerOption(option => option.setName('room').setDescription('der Raum steht in [] daneben').setRequired(true))
  .addIntegerOption(option => option.setName('bed').setDescription('die Nummer des Bettes von oben nach unten').setRequired(true))),
 async execute(client, interaction) {
  switch (interaction.options.getSubcommand()) {
   case 'new':
    if (interaction.options.getInteger('rooms') > 25 || interaction.options.getInteger('beds') > 10 || interaction.options.getInteger('start') < 1) {
     interaction.reply({
      content: 'bitte lese die Tipps', ephemeral: true
     });
     return;
    }
    if (interaction.options.getInteger('rooms') < 1 || interaction.options.getInteger('beds') < 1) {
     interaction.reply({
      content: 'bitte lese die Tipps', ephemeral: true
     });
     return;
    }
    rooms.newPannel(interaction);
    break;
   case 'claim':
    if (interaction.options.getInteger('room') < 1 || interaction.options.getInteger('group') < 1 || interaction.options.getString('character') === null) {
     interaction.reply({
      content: 'bitte lese die Tipps', ephemeral: true
     });
     return;
    }
    rooms.claim(interaction);
    break;
   case 'clear':
    if (interaction.options.getInteger('room') < 1 || interaction.options.getInteger('group') < 1 || interaction.options.getInteger('bed') < 1) {
     interaction.reply({
      content: 'bitte lese die Tipps', ephemeral: true
     });
     return;
    }
    rooms.clear(interaction);
    break;
   case 'delete':
    if (interaction.options.getInteger('group') < 1) {
     interaction.reply({
      content: 'bitte lese die Tipps', ephemeral: true
     });
     return;
    }
    rooms.delete(interaction, interaction.options.getInteger('group'));
    break;
  }
 },
};