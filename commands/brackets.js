const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require ('../libs/db');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('brackets')
 .setDescription('sucht nach Klammernachrichten und löscht sie'),
 async execute(client, interaction) {
  const server = db.getServer(interaction.guildId);

  if (!interaction.member.roles.cache.has(server.adminrole)) {
   interaction.reply({
    content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
   });
   return;
  }
  let delets = [];
  const filters = ['(',
   ')',
   '{',
   '}',
   '[',
   ']'];
  let count = 0;
  let skip = 0;
  let all = 0;
  let del = 0;
  let message;
  await interaction.reply('suche nach Nachrichten, bitte warten');

  await interaction.channel.messages.fetch().then(messages => {
   for (let i = 0; i < filters.length; i++) {
    for (let j = 0; j < messages.filter(msg => msg.content.includes(filters[i])).size; j++) {
     delets.push(messages.filter(msg => msg.content.includes(filters[i])).at(j).id);
     delets = delets.filter(function(ele, pos) {
      return delets.indexOf(ele) == pos;
     });
     interaction.editReply(`\` ${delets.length} \` Nachrichten gefunden!`);
    }}
  });
  await interaction.editReply(`\` ${delets.length} \` Nachrichten gefunden!`);
  all = delets.length;
  for (let i = 0; i < delets.length; i++) {
   interaction.channel.messages.fetch(delets[i]).then(message => {
    message.delete();
    del++;
   }).catch(e => {
    console.log(e);
    skip++;
   });
   await   interaction.editReply(`\` ${del} \` von \` ${all} \` Nachrichten gelöscht!`);
   count++;
  }
  count -= skip;

  await interaction.editReply(`\` ${count} \` Nachrichten von gesamt \` ${all} \` gelöscht, welche ${filters} enthielten. Übersprungen: \` ${skip}\``);

 }
};