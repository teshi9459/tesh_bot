const db = require("../../libs/db");
const dc = require("../../libs/dc");
const fs = require("fs");
const ms = require("ms");
const Jimp = require("jimp");
const {
  MessageEmbed,
  MessageAttachment,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const sql = require("../../libs/sql");
module.exports = {
  data: {
    id: "level",
    setup: true,
  },
  start: function (msg) {
    sql.getChannels(msg.guildId, function (channels) {
      let rightChannel = false;
      let rightContent = true;
      for (const c of channels.length) {
        if (channels[c].id == msg.channelId && channels[c].typth === "Rp") {
          rightChannel = true;
          break;
        }
      }
      if (
        msg.content.startsWith("(") ||
        msg.content.startsWith(")") ||
        msg.content.includes("tul!edit") ||
        msg.content.endsWith("(") ||
        msg.content.endsWith(")")
      ) {
        rightContent = false;
      }
      if (rightChannel && rightContent) {
        try {
          sql.getServer(msg.guildId, function (guild) {
            const count = msg.content.split(" ").length;
            let plusXp = 0;
            if (count < guild.level_min) plusXp++;
            else if (count >= guild.level_min)
              plusXp = Math.round(
                (count / guild.level_unit) * this.getBoost(guild, msg.member)
              );
            sql.getLevelUser(msg.guildId, msg.author.id, function (user) {
              if (user == undefined)
                user = { xp: 0, ping: true, id: msg.author.id };
              const oldLevel = Math.floor(Math.sqrt(user.xp / 2));
              user.xp += plusXp;
              sql.updateLevelUser(msg.guildId, msg.author.id, user.xp);
              if (oldLevel < newLevel) {
                const newLevel = Math.floor(Math.sqrt(user.xp / 2));
                const nextXp = Math.pow(newLevel + 1, 2) * 2;
                let Embed = new MessageEmbed()
                  .setTitle(`🎉__Congratulations ${msg.author.username}__🎉`)
                  .setColor("#aaeeff")
                  .setDescription(
                    `Du hast **Level ${newLevel}** erreicht!\nFür Level ${
                      newLevel + 1
                    } brauchst du **noch ${Math.round(
                      nextXp - user.xp
                    )} XP**\n*schalte den Ping mit \`/level ping\` um*`
                  )
                  .setFooter({
                    text: `Level ${newLevel} - XP ${user.xp} | Tesh-Level-System`,
                    iconURL: msg.guild.iconURL(),
                  });
                sql.getLevelMsg(msg.guildId, newLevel, function (lvmsg) {
                  if (lvmsg != undefined) {
                    Embed.setColor("#cc33cc").setDescription(lvmsg.text);
                    msg.member.roles.add(lvmsg.role);
                  }
                  sql.getChannel(
                    [guild, typth],
                    [guildId, "level"],
                    "AND",
                    function (channel) {
                      channel = dc.getChannel(msg, channel.id);
                      if (user.levelPing) {
                        channel.send({
                          content: `<@!${user.id}>`,
                          embeds: [Embed],
                        });
                      } else {
                        channel.send({
                          embeds: [Embed],
                        });
                      }
                      this.sendImage(
                        channel,
                        msg.author.displayAvatarURL({
                          format: "jpg",
                        }),
                        msg.author.tag,
                        newLevel,
                        user.xp,
                        nextXp
                      );
                    }
                  );
                });
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  },

  getCard: async function (interaction) {
    interaction.reply("fetching Image Data ...");
    let userI = interaction.member.user;
    if (interaction.options.getUser("user") != null)
      userI = interaction.options.getUser("user");
    sql.getLevelUser(interaction.guildId, userI.id, function (user) {
      if (user === undefined) user.xp = 0;
      const level = Math.floor(Math.sqrt(user.xp / 2));
      //copie
      const nextXp = Math.pow(level + 1, 2) * 2;
      const channel = interaction.channel;
      interaction.deleteReply();
      this.sendImage(
        channel,
        userI.displayAvatarURL({
          format: "jpg",
        }),
        userI.tag,
        level,
        user.xp,
        nextXp
      );
    });
  },
  sendImage: async function (channel, fUserIcon, tUserTag, level, xp, nextXp) {
    const cXp = xp;
    nextXp -= Math.pow(level, 2) * 2;
    xp -= Math.pow(level, 2) * 2;
    const farbe = "#aaeeff";
    const maxLänge = 960;
    const xpLänge = maxLänge * (xp / nextXp);
    const bg = await Jimp.read("./media/images/bg.jpg");
    const pb = await Jimp.read(fUserIcon);
    const line = new Jimp(xpLänge, 12, farbe);
    const pbb = new Jimp(210, 210, farbe);
    const lineB = new Jimp(maxLänge, 20, "#99999990");
    const ffont = await Jimp.loadFont("./media/fonts/usertag/usertag_64.fnt");
    const levelfont = await Jimp.loadFont("./media/fonts/level/level_32.fnt");
    //bg 1000x350
    pbb.resize(210, 210);
    pb.resize(200, 200);
    pbb.circle();
    pb.circle();
    bg.blit(pbb, 15, 15);
    bg.blit(pb, 20, 20);
    bg.blit(lineB, 20, 300);
    bg.blit(line, 24, 304);
    if (tUserTag.length > 22) {
      bg.print(ffont, 250, 30, tUserTag.substring(0, 20) + "-");
      bg.print(ffont, 250, 105, tUserTag.substring(20));
    } else {
      bg.print(ffont, 250, 80, tUserTag);
    }
    bg.print(
      levelfont,
      24,
      250,
      "Xp: " + cXp + " - Level: " + level + "  - " + xp + "/" + nextXp + " xp",
      950
    );
    bg.getBufferAsync(Jimp.MIME_JPEG).then((image) => {
      const file = new MessageAttachment(image, "level.jpg");
      channel.send({
        files: [file],
      });
    });
  },
  getBoost: function () {
    /** module, member
    *  let boost = 0;
    if (module.boostRoles != undefined) {
      for (let i = 0; i < module.boostRoles.length; i++) {
        if (
          member.roles.cache.some(
            (role) => role.id == module.boostRoles[i].role
          )
        )
          boost = boost * module.boostRoles[i].index;
      }
    }
    if (module.boostTime != undefined) {
      if (module.boostTime.end > new Date())
        boost = boost * module.boostTime.index;
      else module.boostTime = undefined;
    }
    if (boost === 0) boost++;
    return boost;
    */
    return 1;
  },
  boostDel: async function (interaction) {
    const server = db.getServer(interaction.guildId);
    let module = db.getModuleS(server, "level");
    let timetext = "";
    let roletext = "";
    if (module.boostTime === undefined || module.boostTime === null)
      timetext = "Kein zeitlicher Boost eingerichtet";
    else {
      const time = module.boostTime.end - new Date();
      timetext = `Ein ${module.boostTime.index}x Boost ist für ${ms(
        time
      )} aktiv`;
    }
    let Embed = new MessageEmbed()
      .setTitle(`📈 Boosts 📈`)
      .setColor("#aaeeff")
      .setDescription(timetext)
      .setFooter(`XP Booster | Tesh-Level-System`, interaction.guild.iconURL());
    let fields = [
      {
        label: "Time Boost",
        description: "löscht den zeitlichen Boost",
        value: interaction.guildId + "_time",
      },
    ];
    if (module.boostRoles === undefined || module.boostRoles.length === 0) {
      roletext = "Keine Boostrollen eingerichtet";
      Embed.addField("Rollen", roletext);
    } else {
      for (let i = 0; i < module.boostRoles.length; i++) {
        fields.push({
          label: `${i + 1} - ${module.boostRoles[i].index}x - ${
            module.boostRoles[i].role
          }`,
          description: "löscht Boost für die Rolle",
          value: interaction.guildId + "_role_" + i,
        });
        Embed.addField(
          `${module.boostRoles[i].index}x booster`,
          `${i + 1} - <@&${module.boostRoles[i].role}> - ${
            module.boostRoles[i].role
          }`
        );
      }
    }
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(interaction.guildId + "_boostdel")
        .setPlaceholder("löschen")
        .addOptions(fields)
    );

    await interaction.reply({
      embeds: [Embed],
      components: [row],
    });

    const filter = (i) => i.customId === interaction.guildId + "_boostdel";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 5 * 60 * 1000,
    });
    collector.on("collect", async (i) => {
      if (!i.member.roles.cache.some((role) => role.id == server.adminrole)) {
        i.reply({
          content: `nur <@&${server.adminrole}> können das machen`,
          ephemeral: true,
        });
      }
      let reply;
      if (i.values[0].includes("time")) {
        module.boostTime = undefined;
        reply = dc.makeSimpleEmbed(
          i,
          "#c00000",
          "Zeit Boost gelöscht",
          "es gibt nun keinen Zeit basierten Boost mehr"
        );
      } else if (i.values[0].includes("role")) {
        const index = i.values[0].split("_")[2];
        const role = module.boostRoles[index].role;
        module.boostRoles.splice(index, 1);
        reply = dc.makeSimpleEmbed(
          i,
          "#c00000",
          "Rollen Boost gelöscht",
          "der Boost für die Rolle <@&" + role + "> wurde gelöscht"
        );
      }
      db.updateModuleS(server, module);
      i.reply({
        embeds: [reply],
      });
    });

    collector.on("end", () => {
      interaction.deleteReply();
    });
  },
};
