const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
const dc = require('../libs/dc');
const rooms = require('../libs/rooms');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('rooms')
 .setDescription('Settings for the rooms module')
 .addSubcommand(subcommand =>
  subcommand
  .setName('new')
  .setDescription('generate a new Group of rooms')
  .addStringOption(option => option.setName('name').setDescription('name of the group').setRequired(true))
  .addIntegerOption(option => option.setName('rooms').setDescription('How many rooms should be in this group 1-25').setRequired(true))
  .addIntegerOption(option => option.setName('beds').setDescription('how many beds should be in a room').setRequired(true))
  .addIntegerOption(option => option.setName('start').setDescription('at which number should the rooms start? 1≤').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('claim')
  .setDescription('if you want to claim a room')
  .addIntegerOption(option => option.setName('group').setDescription('the group (stands at the top)').setRequired(true))
  .addIntegerOption(option => option.setName('room').setDescription('the room, witch you want').setRequired(true))
  .addChannelOption(option => option.setName('characterchannel').setDescription('choose the channel your characters are in').setRequired(true))
  .addStringOption(option => option.setName('character').setDescription('name of your character').setRequired(true))
  .addUserOption(option => option.setName('user').setDescription('only if an admin registers someone')))
 .addSubcommand(subcommand =>
  subcommand
  .setName('delete')
  .setDescription('delete a group of rooms')
  .addIntegerOption(option => option.setName('group').setDescription('Group to delete').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('clear')
  .setDescription('clear a bed').addIntegerOption(option => option.setName('group').setDescription('Group to use').setRequired(true))
  .addIntegerOption(option => option.setName('room').setDescription('Room to use').setRequired(true))
  .addIntegerOption(option => option.setName('bed').setDescription('bed to use').setRequired(true))),
 async execute(client, interaction) {
  switch (interaction.options.getSubcommand()) {
   case 'new':
    if (interaction.options.getInteger('rooms') > 25 || interaction.options.getInteger('beds') > 10 || interaction.options.getInteger('start') < 1) {
     interaction.reply('pls read the hints');
     return;
    }
    rooms.newPannel(interaction);
    break;
   case 'claim':
    rooms.claim(interaction);
    break;
   case 'clear':

    break;
   case 'delete':
    rooms.delete(interaction, interaction.options.getInteger('group'));
    break;
  }
 },
};