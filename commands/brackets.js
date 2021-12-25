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

  const filters = ['(',
   ')',
   '{',
   '}',
   '[',
   ']'];
  let count = 0;
  let skip = 0;
  let all = 0;
  let message;
  await interaction.reply('suche nach Nachrichten, bitte warten');

  for (let i = 0; i < filters.length; i++) {
   await interaction.channel.messages.fetch()
   .then(messages => {
    all += messages.filter(msg => msg.content.includes(filters[i])).size;
    for (let j = 0; j < messages.filter(msg => msg.content.includes(filters[i])).size; j++) {
     try {
      messages.filter(msg => msg.content.includes(filters[i])).at(j).delete();
      count++;
     } catch (e) {
      console.error(e)
      skip++;
     }
     console.log(i+'.'+j+'='+count+'/'+skip+'/'+all+'\n'+message)
    }
   })
   .catch(console.error);
  }

  await interaction.editReply(`habe ${count} Nachricht von gesammt ${all}, welche \`${filters}\` enthalten. Übersprungen: ${skip}`);

 }
};