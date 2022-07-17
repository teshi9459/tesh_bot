const { SlashCommandBuilder } = require("@discordjs/builders");
const dc = require("../../libs/dc");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("antwortet mit Pong!"),
  async execute(interaction) {
    const client = interaction.client;
    const rec = interaction.createdTimestamp - new Date();
    const text =
      "`" +
      rec +
      "ms` speed\n\n`" +
      client.ws.ping +
      "ms` ping\n\n`" +
      ms(client.uptime) +
      "` uptime";
    const embed = dc.makeSimpleEmbed(interaction, "#aaeeff", "Pong!", text);
    interaction.reply({
      embeds: [embed],
    });
  },
};
