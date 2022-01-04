const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('antwortet mit Pong!'),
    async execute(client,interaction) {
        await interaction.reply(`Pong!\n\`${client.ws.ping} ms\``);
    },
};