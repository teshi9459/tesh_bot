const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('off')
    .setDescription('Shutdown the client'),
  async execute(client, interaction) {
    if (interaction.user.id != "652959577293324288") {
      await interaction.reply('bist nicht mein Dev :triumph:');
      return;
    }
    await interaction.reply('shutdown :[');

    setTimeout(function () {
      client.destroy();
    }, 1000);
  },
};