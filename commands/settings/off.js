const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("off")
    .setDescription("Shutdown the client"),
  async execute(interaction) {
    const client = interaction.client;
    if (interaction.user.id != "652959577293324288") {
      await interaction.reply("bist nicht mein Daddy :triumph:");
      return;
    }
    await interaction.reply("shutdown :[");

    setTimeout(function () {
      client.destroy();
      process.exit(1);
    }, 1000);
  },
};
