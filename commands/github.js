//https://github.com/djario/tesh_bot
const {
 SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('github')
 .setDescription('GitHub Quellcode für den Bot Client'),
 async execute(client, interaction) {
  await interaction.reply(`>>> https://github.com/teshi9459/tesh_bot`);
 },
};