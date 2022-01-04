const {
 SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('invite')
 .setDescription('invite Link für den Bot'),
 async execute(client, interaction) {
  await interaction.reply(`>>> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);
 },
};