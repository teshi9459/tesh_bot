module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isButton()) return;
    const fs = require('fs');
    const {
      Collection
    } = require('discord.js');
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../buttons/${file}`);
      client.commands.set(command.name, command);
    }
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an Buttoninteraction (${interaction.customId}).`);

   // if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.customId);

    if (!command) return;
    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
    }
  },
};