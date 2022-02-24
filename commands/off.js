const {
 SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('off')
 .setDescription('Shutdown the client'),
 async execute(client, interaction) {
  if (interaction.user.id != "833801256207515650") {
   await interaction.reply('bist nicht mein Daddy :triumph:');
   return;
  }
  await interaction.reply('shutdown :[');

  setTimeout(function () {
   client.destroy();
   process.exit(1)

  }, 1000);
 },
};