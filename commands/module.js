const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const {
 MessageActionRow,
 MessageButton
} = require('discord.js');
const db = require('../libs/db');
const dc = require('../libs/dcTools.js');
const words = require('../module/words');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('module')
 .setDescription('module settings')
 .addStringOption(option =>
  option.setName('module')
  .setDescription('the module to use')
  .setRequired(true)
  .addChoice('words', 'wd')
  // .addChoice('level', 'lv')
 )
 .addStringOption(option =>
  option.setName('choice')
  .setDescription('what is to do?')
  .setRequired(true)
  .addChoice('setup', 'su')
  .addChoice('off', 'of')
  .addChoice('on', 'on')),
 async execute(client, interaction) {
  let server = db.getServer(interaction.guildId);
  let module;
  if (!interaction.member.roles.cache.has(server.adminrole)) return;
  switch (interaction.options.getString('module')) {
   case 'wd':
    switch (interaction.options.getString('choice')) {
     case 'su':
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
          await i.update({
           content: 'Modul `words` wurde erstellt', components: []
          });
         } else if (i.customId === `del_wd_false@${server.id}`) {
          await i.update({
           content: 'abgebrochen', components: []
          });
         }
        });

       collector.on('end',
        collected => console.log(`Collected ${collected.size} items @setup`));
       //ende
      } catch (e) {
       //console.log(e);
       words.setup(interaction,
        server);
       interaction.reply('Modul `words` wurde erstellt');
      }
      break;
     case 'of':
      try {
       module = db.getModuleS(server,
        'words');
       module.enabled = false;
       db.updateModuleS(server,
        module);
       interaction.reply('Modul `words` deaktiviert');
      } catch (e) {
       interaction.reply('bitte führe erst `setup` aus');
      }
      break;
     case 'on':
      try {
       module = db.getModuleS(server,
        'words');
       module.enabled = true;
       db.updateModuleS(server,
        module);
       interaction.reply('Modul `words` aktiviert');
      } catch (e) {
       interaction.reply('bitte führe erst `setup` aus');
      }
      break;
    }
    break;
  }

 }
};