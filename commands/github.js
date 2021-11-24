//https://github.com/djario/tesh_bot
const {
 SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('github')
 .setDescription('GitHub link for the Bot responsitores'),
 async execute(client, interaction) {
  await interaction.reply(`>>> https://github.com/djario/tesh_bot`);
 },
};