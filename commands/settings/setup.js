const { SlashCommandBuilder } = require("@discordjs/builders");
const { Formatters } = require("discord.js");
const db = require("../../libs/db");
const dc = require("../../libs/dc");
const sql = require("../../libs/sql");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("installiert den Bot für den Server")
    .addRoleOption((option) =>
      option
        .setName("admin")
        .setDescription("Admin Rolle (kann ALLE Einstellungen vornehmen)")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("tesh")
        .setDescription(
          "Tesh Rolle (kann Moderation-Commands benutzen)(bei auslassen wird eine Rolle erstellt)"
        )
    ),
  async execute(interaction) {
    sql.getServer(interaction.guildId, function (server) {
      if (server !== undefined) {
        const Embed = dc.makeSimpleEmbed(
          interaction,
          "#aaeeff",
          "Tesh-Bot Setup",
          `Dieser Server ist bereits aufgenommen!`
        );
        return interaction.reply({ embeds: [Embed] });
      } else {
        const adminrole = interaction.options.getRole("admin");
        let teshrole = interaction.options.getRole("tesh");
        if (teshrole === null) {
          interaction.guild.roles
            .create({
              name: "Tesh Commander",
              reason: "benötigt zum ausführen von Moderation-Commands",
            })
            .then((role) => {
              teshrole = role;
              sql.setServer(interaction.guildId, adminrole.id, teshrole.id);
              const Embed = dc.makeSimpleEmbed(
                interaction,
                "#aaeeff",
                "Tesh-Bot Setup",
                `Das Setup wurde abgeschlossen und steht nun zur verfügung.\n\n**Adminrolle:** ${Formatters.roleMention(
                  adminrole.id
                )}\n**Teshrolle:** ${Formatters.roleMention(teshrole.id)}`
              );

              interaction.reply({ embeds: [Embed] });
            })
            .catch(console.error);
          return;
        } else {
          sql.setServer(interaction.guildId, adminrole.id, teshrole.id);
          const Embed = dc.makeSimpleEmbed(
            interaction,
            "#aaeeff",
            "Tesh-Bot Setup",
            `Das Setup wurde abgeschlossen und steht nun zur verfügung.\n\n**Adminrolle:** ${Formatters.roleMention(
              adminrole
            )}\n**Teshrolle:** ${Formatters.roleMention(teshrole)}`
          );

          return interaction.reply({ embeds: [Embed] });
        }
      }
    });
  },
};
