const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../../libs/db');
const dc = require('../../libs/dc');
const ms = require('ms');
const lv = require('../../exports/message/level');
module.exports = {
 data: new SlashCommandBuilder()
 .setName('level')
 .setDescription('Einstellungen für Level')
 .addSubcommand(subcommand =>
  subcommand
  .setName('card')
  .setDescription('zeigt aktuelles Level und XP')
  .addUserOption(option =>
   option
   .setName('user')
   .setDescription('zeigt das level von jemand anderem')))
 .addSubcommand(subcommand =>
  subcommand
  .setName('setup')
  .setDescription('erstellt das Level System'))
 .addSubcommand(subcommand =>
  subcommand
  .setName('ping')
  .setDescription('ändert Pings für Level Nachrichten')
  .addBooleanOption(option =>
   option
   .setName('setting')
   .setDescription('schalte an oder aus')))
 .addSubcommand(subcommand =>
  subcommand
  .setName('power')
  .setDescription('schaltet level an und aus')
  .addBooleanOption(option =>
   option
   .setName('setting')
   .setDescription('an = true aus = false')
   .setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('custom')
  .setDescription('only Team - setzt besondere Level Texte und Rollen')
  .addIntegerOption(option => option.setName('level').setDescription('Level welches ausgewählt werden soll').setRequired(true))
  .addStringOption(option => option.setName('text').setDescription('Text der in der Nachricht angezeigt wird').setRequired(true))
  .addRoleOption(option => option.setName('rolle').setDescription('Rolle die bei erreichen des Levels vergeben wird').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('clear')
  .setDescription('löscht einen besonderen Leveltext oder eine Levelrolle').addIntegerOption(option => option.setName('level').setDescription('Level welches ausgewählt werden soll').setRequired(true)))
 .addSubcommand(subcommand =>
  subcommand
  .setName('boost_role')
  .setDescription('dauerhafter Xp-Boost für eine Rolle')
  .addIntegerOption(option => option.setName('boost').setDescription('um wie viel die neuen XP multipliziert werden sollen (50% = 1.5)| >1').setRequired(true))
  .addRoleOption(option => option.setName('rolle').setDescription('welche Rolle').setRequired(true))
 )
 .addSubcommand(subcommand =>
  subcommand
  .setName('boost_time')
  .setDescription('zeitweiser Xp-Boost für alle')
  .addIntegerOption(option => option.setName('boost').setDescription('um wie viel die neuen XP multipliziert werden sollen (50% = 1.5)| >1').setRequired(true))
  .addIntegerOption(option => option.setName('zeit').setDescription('wie lange in stunden').setRequired(true))
 )
 .addSubcommand(subcommand =>
  subcommand
  .setName('boost_del')
  .setDescription('zeigt Booster Liste zum löschen')
 ),
 async execute(client, interaction) {
  let server = db.getServer(interaction.guildId);
  let module = db.getModuleS(server, 'level');
  switch (interaction.options.getSubcommand()) {
   case 'setup':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }
    lv.setup(interaction, server);
    break;
   case 'clear':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }
    //clear
    for (let i = 0; i < module.level.length; i++) {
     if (module.level[i].index == interaction.options.getInteger('level')) {
      module.level.splice(i, 1);
     }
    }
    db.updateModuleS(server, module);
    interaction.reply(`Level ${interaction.options.getInteger('level')} hat nun keine Rolle oder besondere Nachricht mehr`);
    break;
   case 'costum':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }
    module.level.push({
     index: interaction.options.getInteger('level'),
     text: interaction.options.getString('text'),
     role: interaction.options.getRole('rolle').id
    });
    db.updateModuleS(server, module);
    interaction.reply(`Level ${interaction.options.getInteger('level')} hat nun den Text: \`${interaction.options.getString('text')}\` und man bekommt die Rolle: <@&${interaction.options.getRole('rolle').id}>`);
    break;
   case 'power':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }
    module.enabled = interaction.options.getBoolean('setting');
    db.updateModuleS(server, module);
    let sett = 'aus';
    if (module.enabled) sett = 'an';
    interaction.reply('das Modul ist nun ` ' + sett + ' `');
    break;
   case 'ping':
    const user = db.getUser(server, interaction.member.id);
    user.levelPing = interaction.options.getBoolean('setting');
    db.updateUser(server, user);
    let ping = 'aus';
    if (user.levelPing) ping = 'an';
    interaction.reply({
     content: 'der Ping ist nun ` ' + ping + ' `', ephemeral: true
    });
    break;
   case 'card':
    lv.getCard(interaction);
    break;
   case 'boost_role':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }

    if (module.boostRoles === undefined)
     module.boostRoles = [];
    module.boostRoles.push({
     role: interaction.options.getRole('rolle').id, index: interaction.options.getInteger('boost')
    });
    db.updateModuleS(server, module);

    interaction.reply({
     embeds: [dc.makeSimpleEmbed(interaction, "#aaeeff", "Boost Rolle erstellt", "Für die Rolle <@&" + interaction.options.getRole('rolle')+ "> ist ein Boost von "+ interaction.options.getInteger('boost')+"x aktiv")]});
    break;
   case 'boost_time':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }

    const time = interaction.options.getInteger('zeit') * 60 * 60 * 1000;
    module.boostTime = {
     end: Date.now() + time,
     index: interaction.options.getInteger('boost')
    };
    db.updateModuleS(server, module);
    interaction.reply({
     embeds: [dc.makeSimpleEmbed(interaction, "#aaeeff", "Boost erstellt", "Für " + ms(time)+ " ist ein Boost von "+ interaction.options.getInteger('boost')+"x aktiv")]});
    break;
   case 'boost_del':
    if (!interaction.member.roles.cache.has(server.adminrole)) {
     interaction.reply({
      content: `nur <@&${server.adminrole}> können das machen`, ephemeral: true
     });
     return;
    }
    lv.boostDel(interaction);
    break;
  }
 },
};