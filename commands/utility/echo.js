const {
 SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('echo')
 .setDescription('antwortet mit gegebenen Input')
 .addStringOption(option =>
  option.setName('input')
  .setDescription('Text zum antworten')
  .setRequired(true)),
 async execute(client, interaction) {
  interaction.reply(interaction.options.getString('input'));
 },
};