const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Infos und Links"),
  async execute(interaction) {
    const Embed = new MessageEmbed()
      .setColor("#aaeeff")
      .setTitle("Infosheet")
      .setURL("http://tesh.qg")
      .setDescription("Hier sind einige Links:")
      .setThumbnail(
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      )
      .addFields(
        { name: "Github", value: "https://github.com/teshi9459/tesh_bot" },
        { name: "Teshboard", value: "http://tesh.gq" },
        { name: "Discord Server", value: "-" }
      )
      .setFooter({
        text:
          interaction.client.user.username + "-Bot | " + "Made with ♡ by Teshi",
        iconURL: interaction.guild.iconURL(),
      });
    await interaction.reply({ embeds: [Embed] });
  },
};
