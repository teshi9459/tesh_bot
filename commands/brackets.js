const {
 SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('brackets')
 .setDescription('searches the last 100 messages for brackets'),
 async execute(client, interaction) {
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