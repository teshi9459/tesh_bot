const {
 SlashCommandBuilder
} = require('@discordjs/builders');
const fs = require('fs');
const archiver = require('archiver');

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
  interaction.reply("``` Backup wird generiert ```");


  var output = fs.createWriteStream('./backup.zip');
  var archive = archiver('zip');

  output.on('close', function() {
   console.log(archive.pointer() + ' total bytes');
   console.log('archiver has been finalized and the output file descriptor has closed.');
   interaction.editReply({
    content: "``` Backup wurde erstellt ✓ ```\nbitte speicher die Datei ab\ndiese Nachricht wird in 1 min gelöscht", files: ['./backup.zip']});
   setTimeout(function() {
    interaction.deleteReply();
   }, 61*1000);
  });

  archive.on('error', function(err) {
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