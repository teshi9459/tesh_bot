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
 },
 getChannel: function(message, id) {
  const obj = message.guild.channels.cache.find(c => c.id == id);
  return obj;
 },
 getUser: function(message, id) {
  const obj = message.guild.members.cache.find(c => c.id == id);
  return obj;
 },
 getRole: function(message, id) {
  const obj = message.guild.roles.cache.find(c => c.id == id);
  return obj;
 },
 editMessage: function(message, cid, id, content) {
  const channel = this.getChannel(message, cid);
  channel.messages.fetch(id).then(msg => msg.edit(content));
 },
 getMessage: function (message, cid, content) {
  const channel = this.getChannel(message, cid);
  channel.messages.fetch(content).then(msg => msg)
 },
 getCategory: function (message, id) {
  const obj = this.getChannel(message, id);
  return obj;
 },
 getLastMessage: function (channel) {
  const messages = channel.messages.fetch({
   limit: 2
  });
  return messages.last();
 },
 delMsg: function (message, time) {
  setTimeout(function() {
   message.delete();
  }, time);
 }
};