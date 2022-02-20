const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
const stats = require('../message/stats');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('only Teshi - startet Analytics')
        .setDefaultPermission(false),
    async execute(client,
        interaction) {
        let server;
        try {
            server = db.getServer(interaction.guildId);
        } catch (e) {
            console.error(e);
            interaction.reply('bitte starte zuerst `/setup`');
            return;
        }

        if (!interaction.member.roles.cache.has(server.adminrole)) return;
        stats.setup(interaction);
    },
};