const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../libs/db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("del")
    .setDescription("löscht X Nachrichten")
    .addIntegerOption((option) =>
      option
        .setName("x")
        .setDescription("wie viel Nachrichten sollen gelöscht werden")
        .setRequired(true)
    ),
  async execute(interaction) {
    const server = db.getServer(interaction.guildId);
    if (!interaction.member.roles.cache.has(server.adminrole)) return;
    const amount = interaction.options.getInteger("x");

    if (amount <= 1 || amount > 100) {
      interaction.reply("bitte wähle eine Zahl von 1 - 100");
      setTimeout(function () {
        interaction.deleteReply();
      }, 3000);
      return;
    }

    interaction.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      interaction.reply(`konnte ${amount} Nachrichten nicht löschen`);
      setTimeout(function () {
        interaction.deleteReply();
      }, 5 * 1000);
      return;
    });
    interaction.reply("fertig");
    setTimeout(function () {
      interaction.deleteReply();
    }, 5 * 1000);
  },
};
