const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const dc = require('../libs/dc');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('ping')
 .setDescription('antwortet mit Pong!'),
 async execute(client, interaction) {
  const rec = interaction.createdTimestamp - new Date();
  const text = "`"+ rec +"ms` speed\n\n`"+client.ws.ping+"ms` ping\n\n`"+ client.uptime+"ms` uptime"
  const embed = dc.makeSimpleEmbed(interaction, "#aaeeff", "Pong!", text);
  await interaction.reply({
   embeds: [embed]});
 },
};