const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../libs/db");
const dc = require("../../libs/dc");
const ms = require("ms");
const lv = require("../../exports/message/level");
const sql = require("../../libs/sql");
const { Formatters } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Einstellungen für Level")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("card")
        .setDescription("zeigt aktuelles Level und XP")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("zeigt das level von jemand anderem")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("only Team - installiert das Level System")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "wähle einen Benachrichtigungschannel (wird sonst erstellt)"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ping")
        .setDescription("ändert Pings für Level Nachrichten")
        .addBooleanOption((option) =>
          option
            .setName("setting")
            .setDescription("schalte an oder aus")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("power")
        .setDescription("only Team - schaltet level an und aus")
        .addBooleanOption((option) =>
          option
            .setName("setting")
            .setDescription("an = true aus = false")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("custom")
        .setDescription("only Team - setzt besondere Level Texte und Rollen")
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("Level welches ausgewählt werden soll")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("Text der in der Nachricht angezeigt wird")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("rolle")
            .setDescription("Rolle die bei erreichen des Levels vergeben wird")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription(
          "only Team - löscht einen besonderen Leveltext oder eine Levelrolle"
        )
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("Level welches ausgewählt werden soll")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("boost_role")
        .setDescription("only Team - dauerhafter Xp-Boost für eine Rolle")
        .addIntegerOption((option) =>
          option
            .setName("boost")
            .setDescription(
              "um wie viel die neuen XP multipliziert werden sollen (50% = 1.5)| >1"
            )
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("rolle")
            .setDescription("welche Rolle")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("boost_time")
        .setDescription("only Team - zeitweiser Xp-Boost für alle")
        .addIntegerOption((option) =>
          option
            .setName("boost")
            .setDescription(
              "um wie viel die neuen XP multipliziert werden sollen (50% = 1.5)| >1"
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("zeit")
            .setDescription("wie lange in stunden")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("boost_del")
        .setDescription("only Team - zeigt Booster Liste zum löschen")
    ),
  async execute(client, interaction) {
    switch (interaction.options.getSubcommand()) {
      case "setup":
        sql.getServer(interaction.guildId, function (guild) {
          if (!interaction.member.roles.cache.has(guild.teshrole)) {
            return interaction.reply({
              content: `du brauchst <@&${guild.teshrole}> um das zu machen`,
              ephemeral: true,
            });
          }
          //schon installiert check
          let Channel = interaction.options.getChannel("channel");
          if (Channel === null) {
            interaction.guild.channels
              .create("level", { reason: "Channel for Level Notifications" })
              .then((newChannel) => {
                sql.setLevel(interaction.guildId, guild.moduls, newChannel);
                const Embed = dc.makeSimpleEmbed(
                  interaction,
                  "#33cc33",
                  "Level installiert",
                  `**Infos:**\nAlle Channel, die mit \` Rp \` makiert sind, werden nun zum leveln eingeschlossen.\nNachrichten die am Anfang oder Ende \` ( \`, \` ) \` oder \` tul!edit \` enthalten werden ignoriert.\n Benachrichtigungen werden in ${Formatters.channelMention(
                    newChannel.id
                  )} geschickt.\n\n**Boosts:**\n\`/level boost_\`... erstellt einen Zeitlichen oder Rollen basierten Boost.\n\n**Level Message:**\n\`/level custom\` erstellt eine spezielle Level Nachricht. Optional kann eine Rolle ab dem ausgewähltem Level vergeben werden.`
                );
                interaction.reply({ embeds: [Embed] });
              });
          } else {
            sql.setLevel(interaction.guildId, Channel);
            const Embed = dc.makeSimpleEmbed(
              interaction,
              "#33cc33",
              "Level installiert",
              `**Infos:**\nAlle Channel, die mit \` Rp \` makiert sind, werden nun zum leveln eingeschlossen.\nNachrichten die am Anfang oder Ende \` ( \`, \` ) \` oder \` tul!edit \` enthalten werden ignoriert.\n Benachrichtigungen werden in ${Formatters.channelMention(
                Channel.id
              )} geschickt.\n\n**Boosts:**\n\`/level boost_\`... erstellt einen Zeitlichen oder Rollen basierten Boost.\n\n**Level Message:**\n\`/level custom\` erstellt eine spezielle Level Nachricht. Optional kann eine Rolle ab dem ausgewähltem Level vergeben werden.`
            );
            interaction.reply({ embeds: [Embed] });
          }
        });
        break;
      case "clear":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }
        //clear
        for (let i = 0; i < module.level.length; i++) {
          if (
            module.level[i].index == interaction.options.getInteger("level")
          ) {
            module.level.splice(i, 1);
          }
        }
        db.updateModuleS(server, module);
        interaction.reply(
          `Level ${interaction.options.getInteger(
            "level"
          )} hat nun keine Rolle oder besondere Nachricht mehr`
        );
        break;
      case "costum":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }
        module.level.push({
          index: interaction.options.getInteger("level"),
          text: interaction.options.getString("text"),
          role: interaction.options.getRole("rolle").id,
        });
        db.updateModuleS(server, module);
        interaction.reply(
          `Level ${interaction.options.getInteger(
            "level"
          )} hat nun den Text: \`${interaction.options.getString(
            "text"
          )}\` und man bekommt die Rolle: <@&${
            interaction.options.getRole("rolle").id
          }>`
        );
        break;
      case "power":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }
        module.enabled = interaction.options.getBoolean("setting");
        db.updateModuleS(server, module);
        let sett = "aus";
        if (module.enabled) sett = "an";
        interaction.reply("das Modul ist nun ` " + sett + " `");
        break;
      case "ping":
        const user = db.getUser(server, interaction.member.id);
        user.levelPing = interaction.options.getBoolean("setting");
        db.updateUser(server, user);
        let ping = "aus";
        if (user.levelPing) ping = "an";
        interaction.reply({
          content: "der Ping ist nun ` " + ping + " `",
          ephemeral: true,
        });
        break;
      case "card":
        lv.getCard(interaction);
        break;
      case "boost_role":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }

        if (module.boostRoles === undefined) module.boostRoles = [];
        module.boostRoles.push({
          role: interaction.options.getRole("rolle").id,
          index: interaction.options.getInteger("boost"),
        });
        db.updateModuleS(server, module);

        interaction.reply({
          embeds: [
            dc.makeSimpleEmbed(
              interaction,
              "#aaeeff",
              "Boost Rolle erstellt",
              "Für die Rolle <@&" +
                interaction.options.getRole("rolle") +
                "> ist ein Boost von " +
                interaction.options.getInteger("boost") +
                "x aktiv"
            ),
          ],
        });
        break;
      case "boost_time":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }

        const time = interaction.options.getInteger("zeit") * 60 * 60 * 1000;
        module.boostTime = {
          end: Date.now() + time,
          index: interaction.options.getInteger("boost"),
        };
        db.updateModuleS(server, module);
        interaction.reply({
          embeds: [
            dc.makeSimpleEmbed(
              interaction,
              "#aaeeff",
              "Boost erstellt",
              "Für " +
                ms(time) +
                " ist ein Boost von " +
                interaction.options.getInteger("boost") +
                "x aktiv"
            ),
          ],
        });
        break;
      case "boost_del":
        if (!interaction.member.roles.cache.has(server.adminrole)) {
          interaction.reply({
            content: `nur <@&${server.adminrole}> können das machen`,
            ephemeral: true,
          });
          return;
        }
        lv.boostDel(interaction);
        break;
    }
  },
};
