const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const fs = require('fs');
const archiver = require('archiver');
const {
 MessageActionRow,
 MessageButton
} = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('backup')
 .setDescription('generiert ein Backup'),
 async execute(client, interaction) {
  if (!interaction.user.id === interaction.guild.ownerId||!interaction.user.id === '652959577293324288') {
   interaction.reply({
    content: `du bist nicht befugt das zu machen`, ephemeral: true
   });
   return;
  };
  await interaction.reply("``` Backup wird generiert ```");

  var output = fs.createWriteStream('./backup.zip');
  var archive = archiver('zip');

  output.on('close', function() {
   console.log(archive.pointer() + ' total bytes');
   console.log('archiver has been finalized and the output file descriptor has closed.');
   if (archive.pointer() >= 8*1000*1000) {
    fs.renameSync('./backup.zip', './web/backup.zip');
    const row = new MessageActionRow()
    .addComponents(
     new MessageButton()
     .setLabel('Download')
     .setStyle('LINK')
     .setURL('http://tesh.gq/download/backup'),
    );
    interaction.editReply({
     content: "``` Backup wurde erstellt ✓ ```\nbitte speicher die Datei ab\ndie Datei wird in 3 min gelöscht", components: [row]
    });
    setTimeout(function() {
     interaction.deleteReply();
     fs.rmSync('./web/backup.zip', {
      recursive: false
     });
    }, 3*61*1000);
   } else {
    interaction.editReply({
     content: "``` Backup wurde erstellt ✓ ```\nbitte speicher die Datei ab\ndiese Nachricht wird in 1 min gelöscht", files: ['./backup.zip']});
    setTimeout(function() {
     interaction.deleteReply();
    }, 61*1000);
   }});

  archive.on('error',
   function(err) {
    throw err;
   });

  archive.pipe(output);
  if (interaction.user.id === '652959577293324288') {
   archive.directory(`./DB/`, true, {
    date: new Date()
   });
  } else {
   archive.directory(`./DB/$ {
    interaction.guildId
    }/`, true, {
     date: new Date()
    });
  }
  archive.finalize();
 },
};