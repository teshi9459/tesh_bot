const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('setup den Bot für den Server')
        .addRoleOption(option =>
            option.setName('admin')
                .setDescription('Admin Rolle (kann Bot Einstellungen vornehmen)')
                .setRequired(true)),
    async execute(client, interaction) {
        try {
            if (db.getServer(interaction.guildId).setup) {
                interaction.reply('Kein setup nötig :)');
                return;
            }
        } catch (e) { }
        db.setServer(interaction.guild,);
        let server = db.getServer(interaction.guildId);
        const role = interaction.options.getRole('admin');
        server.adminrole = role.id;
        interaction.guild.channels.create("Tesh Bot", {
            type: "GUILD_CATEGORY"
        }).then(category => {           
            let sv = db.getServer(category.guildId);
            sv.category = category.id;
            db.updateServer(sv);
        });

        server.setup = true;
        server = db.updateServer(server);
        db.setChannels(server);
        interaction.reply('fertig mit setup :relieved:');
    },
};