const {
 MessageActionRow,
 MessageButton
} = require('discord.js');
const db = require('../libs/db');
const dc = require('../libs/dc');

module.exports = {
 wordsSetup: function (interaction) {
  const words = require('../message/words');
  let server = db.getServer(interaction.guildId);
  let module;
  const answer = {
   content: ' ',
   embeds: [dc.makeSimpleEmbed(interaction, '#c9f4ff',
    'Modul Words Setup',
    'Das Modul **words** wurde erstellt und kann jetzt benutz werden')],
   components: []};
  if (!interaction.member.roles.cache.has(server.adminrole)) return;
  try {
   module = db.getModuleS(server, 'words');

   const row = new MessageActionRow()
   .addComponents(
    new MessageButton()
    .setCustomId(`del_wd_true@${server.id}`)
    .setLabel('Ja')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId(`del_wd_false@${server.id}`)
    .setLabel('Nein')
    .setStyle('DANGER'),
   );
   interaction.reply({
    content: '>>> Modul `words` besteht bereits, willst du es neu aufsetzen?',
    components: [row]
   });
   //dann in eventlistener für buttons
   const filter = i => i.customId === `del_wd_false@${server.id}` || i.customId === `del_wd_true@${server.id}` && i.member.roles.cache.has(server.adminrole);

   const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000
   });

   collector.on('collect',
    async i => {
     if (i.customId === `del_wd_true@${server.id}`) {
      words.setup(interaction, server);
      await i.update(answer);
     } else if (i.customId === `del_wd_false@${server.id}`) {
      await i.update({
       content: 'abgebrochen', components: []
      });
     }
    });

   collector.on('end',
    collected => console.log(`Collected ${collected.size} items @setupwords`));
   //ende
  } catch (e) {
   //console.log(e);
   words.setup(interaction,
    server);
   interaction.reply(answer);
  }
 }
};