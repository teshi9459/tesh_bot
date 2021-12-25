const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require ('../libs/db');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('brackets')
 .setDescription('searches the last 100 messages for brackets'),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);

  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: `nur <@${server.adminrole}> können das machen`, ephemeral: true
   });
  }
  interaction.channel.messages.fetch()
  .then(messages => {
   const filters = ['(', ')', '{', '}', '[', ']'];
   let count = 0;
   for (let i = 0; i < filters.length; i++) {
    for (let j = 0; j < messages.filter(msg => msg.content.includes(filters[i])).size; j++) {
     messages.filter(msg => msg.content.includes(filters[i])).at(j).delete();
     count++;
    }
   }
   interaction.reply(`deleted ${count} Messages with \`${filters}\``);
  })
  .catch(console.error);
 }
};