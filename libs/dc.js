const {
 MessageEmbed
} = require('discord.js');
module.exports = {
 makeSimpleEmbed: function (interaction, color, title, text) {
  const Embed = new MessageEmbed()
  .setColor(color)
  .setTitle(title)
  .setDescription(text)
  .setThumbnail(interaction.client.user.avatarURL())
  .setFooter(`${interaction.guild.name} | ${interaction.client.user.username}-Bot`, interaction.guild.iconURL());
  return Embed;
 }
};