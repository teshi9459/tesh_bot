module.exports = {
 name: 'interactionCreate',
 async execute(client, interaction) {
  if (interaction.isButton()) return;
  const fs = require('fs');
  const {
   Collection
  } = require('discord.js');
  client.commands = new Collection();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
   const command = require(`../commands/${file}`);
   client.commands.set(command.data.name, command);
  }
  const date = new Date().toISOString();
  console.log(`\n${date}>> ${interaction.user.tag} triggered an interaction (${interaction.commandName}).`);
  let content;
  try {
   content = `\n${date}>>${interaction.commandName}.${interaction.options.getSubcommand()}@${interaction.user.tag}#${interaction.channel.name}`;
  } catch (e) {
   content = `\n${date}>>${interaction.commandName}@${interaction.user.tag}#${interaction.channel.name}`;
  }

  fs.writeFile(`./DB/${
   interaction.guildId
   }/interactions.log`, content, {
    flag: 'a+'
   }, err => {});

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  try {
   await command.execute(client, interaction);
  } catch (error) {
   console.error(error);
   await interaction.reply({
    content: 'Ein Fehler ist aufgetreten qwq\n*kontaktiere den Developer*', ephemeral: true
   });
  }

 },
};