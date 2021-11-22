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
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction (${interaction.commandName}).`);

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    try {
      await command.execute(client,interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!', ephemeral: true
      });
    }

  },
};