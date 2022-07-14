const { SlashCommandBuilder } = require("@discordjs/builders");
const { Formatters } = require("discord.js");
const dc = require("../../libs/dc");
const sql = require("../../libs/sql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("ändert die RP Channel des Servers")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("fügt einen Channel zur Liste hinzu")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("der Channel zum hinzufügen")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("typ")
            .setDescription(
              "Typ des Channels oder aller Channel in der Kategorie"
            )
            .setRequired(true)
            .addChoice("Roleplay", "Rp")
            .addChoice("Normal", "Nl")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("del")
        .setDescription("löscht Channel aus der liste die gelöscht wurden")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("spezifischer Channel der gelöscht werden soll")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("zeigt alle aufgenommenen Channel")
    ),
  async execute(client, interaction) {
    sql.getServer(interaction.guildId, function (guild) {
      if (!interaction.member.roles.cache.has(guild.teshrole)) {
        return interaction.reply({
          content: `du brauchst <@&${guild.teshrole}> um das zu machen`,
          ephemeral: true,
        });
      }
      switch (interaction.options.getSubcommand()) {
        case "add":
          var channel = interaction.options.getChannel("channel");
          var sType = interaction.options.getString("typ");
          if (channel.type === "GUILD_CATEGORY") {
            sql.getChannels(interaction.guildId, function (channels) {
              let liste = "";
              for (let u = 0; u < channel.children.size; u++) {
                let doppelt = false;
                for (let i = 0; i < channels.length; i++) {
                  if (channel.children.at(u).id == channels[i].id) {
                    doppelt = true;
                    break;
                  }
                }
                if (!doppelt) {
                  sql.newChannel(
                    interaction.guildId,
                    channel.children.at(u),
                    sType
                  );
                  liste += `${Formatters.channelMention(
                    channel.children.at(u).id
                  )} • \` ${sType} \`\n`;
                }
              }
              const Embed = dc.makeSimpleEmbed(
                interaction,
                "#33cc33",
                "Channel hinzugefügt",
                `Die Channel aus ${Formatters.channelMention(
                  channel.id
                )} wurden nun aufgenommen.\n\n${liste}`
              );
              return interaction.reply({ embeds: [Embed] });
            });
          } else {
            sql.getChannels(interaction.guildId, function (channels) {
              for (let i = 0; i < channels.length; i++) {
                if (channel.id == channels[i].id) {
                  const Embed = dc.makeSimpleEmbed(
                    interaction,
                    "#ff0000",
                    "Falscher Channel",
                    "Der Channel ist bereits aufgenommen."
                  );
                  return interaction.reply({ embeds: [Embed] });
                }
              }
              sql.newChannel(interaction.guildId, channel, sType);
              const Embed = dc.makeSimpleEmbed(
                interaction,
                "#33cc33",
                "Channel hinzugefügt",
                `Der Channel ist nun aufgenommen.\n${Formatters.channelMention(
                  channel.id
                )} • \` ${sType} \``
              );
              return interaction.reply({ embeds: [Embed] });
            });
          }
          break;
        case "del":
          var channel = interaction.options.getChannel("channel");

          sql.getChannels(interaction.guildId, function (channels) {
            if (channel !== null) {
              if (channel.type === "GUILD_CATEGORY") {
                let liste = "";
                for (let u = 0; u < channel.children.size; u++) {
                  sql.delChannel(interaction.guildId, channel.children.at(u));
                  liste += `${Formatters.channelMention(
                    channel.children.at(u).id
                  )}\n`;
                }
                const Embed = dc.makeSimpleEmbed(
                  interaction,
                  "#33cc33",
                  "Channel entfernt",
                  `Alle Channel aus ${Formatters.channelMention(
                    channel.id
                  )} gelöscht.\n\n${liste}`
                );
                return interaction.reply({ embeds: [Embed] });
              } else {
                for (let i = 0; i < channels.length; i++) {
                  if (channel.id == channels[i].id) {
                    sql.delChannel(interaction.guildId, channel);
                    const Embed = dc.makeSimpleEmbed(
                      interaction,
                      "#33cc33",
                      "Channel entfernt",
                      Formatters.channelMention(channel.id) + " wurde gelöscht."
                    );
                    return interaction.reply({ embeds: [Embed] });
                  }
                }
                const Embed = dc.makeSimpleEmbed(
                  interaction,
                  "#ff0000",
                  "Falscher Channel",
                  "Der Channel ist nicht gelistet"
                );
                return interaction.reply({ embeds: [Embed] });
              }
            } else {
              let index = 0;
              for (let i = 0; i < channels.length; i++) {
                const obj = interaction.guild.channels.cache.find(
                  (c) => c.id == channels[i].id
                );
                if (obj === undefined) {
                  index++;
                  sql.delChannel(interaction.guildId, channels[i]);
                }
              }
              const Embed = dc.makeSimpleEmbed(
                interaction,
                "#33cc33",
                "Channel entfernt",
                `Es wurden \` ${index} \` alte Channel entfernt.`
              );
              return interaction.reply({ embeds: [Embed] });
            }
          });
          break;
        case "list":
          sql.getChannels(interaction.guildId, function (channels) {
            let index = 0;
            let text = "";
            for (let i = 0; i < channels.length; i++) {
              index++;
              text += "● " + Formatters.channelMention(channels[i].id) + "\n";
            }
            text =
              `**Es sind \` ${index} \` Channel gelistet:**\n\n` + text + "\n";
            const Embed = dc.makeSimpleEmbed(
              interaction,
              "#aaeeff",
              "Channelliste",
              text
            );
            return interaction.reply({ embeds: [Embed] });
          });
          break;
        default:
          break;
      }
    });
  },
};
