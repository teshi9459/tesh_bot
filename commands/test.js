const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const {
 MessageEmbed
} = require('discord.js');

const dc = require('../libs/dc');
module.exports = {

 data: new SlashCommandBuilder()
 .setName('test')
 .setDescription('runs test command')
 /** .addStringOption(option =>
 option.setName('input')
 .setDescription('The input')
 .setRequired(true)
 )**/,
 async execute(client, interaction) {

  // inside a command, event listener, etc.
//#c9fcff
  await interaction.reply({
   embeds: [dc.makeSimpleEmbed(client, interaction, '#c2f3ff', 'Test Embed', 'Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.Ganz langer text.'+interaction.channel)]
  });

 },
}