const db = require('../libs/db');
const dc = require('../libs/dc');
module.exports = {
 data: {
  id: 'words',
  setup: true
 },
 start: function (msg) {
  let user;
  try {
   const server = db.getServer(msg.guildId);
    try {
  user = db.getUser(server, msg.author.id);
  } catch (e) {
   db.setUser(server,msg.author);
  user = db.getUser(server, msg.author.id);
  }
   let reports = db.getReports(server, user);
   const channel = db.getChannels(server);
   let module = db.getModuleS(server, 'words');
   if (module.enabled)
    this.main(msg, server, module, user, reports, channel);
  } catch (e) {
   console.error(e);
  }
 },
 main: function (msg, server, module, user, reports, channel) {
  if (msg.content.includes('(') || msg.content.includes(')') ||
   msg.content.includes('[') || msg.content.includes(']') ||
   msg.content.includes('{') || msg.content.includes('}')) return;
  for (let i = 0; i < channel.length; i++) {
   if (msg.channel.parentId == channel[i]) {
    const message = msg.content.split(' ');
    if (message.length > module.min && message.length < module.max) {
     // msg.reply(module.txt).then(msg => {
     // dc.delMsg(msg, module.delTime);
     // });
     db.newReport(server, user, {
      id: 'words',
      level: module.reportLevel,
      msg: msg,
      info: "Regelverstoß von <@" + msg.author + "> in <#" + msg.channel + "> (" + message.length + " Wörter)\n`" + msg.content + "`\nUser Reports: " + reports.length + "\n" + msg.url
     });
     const log = dc.getChannel(msg, module.log);
     log.send(">>> Regelverstoß von <@" + msg.author + "> in <#" + msg.channel + "> (" + message.length + " Wörter)\n`" + msg.content + "`\nUser Reports: " + reports.length + "\n" + msg.url);
    }
    return;
   }
  }
 },
 setup: function (interaction, server) {
  db.setModuleS(server, {
   id: 'words', enabled: false
  });
  let  module = db.getModuleS(server,
   'words');
  module.max = 10;
  module.min = 2;
  module.reportLevel = 2;
  module.delTime = 5*60*1000;
  module.txt = '>>> Verwarnung Words';
  const category = dc.getChannel(interaction,
   server.category);
  interaction.guild.channels.create("words-log",
   {
    type: "GUILD_TEXT"
   }).then(channel => {
    channel.setParent(category);
    channel.permissionOverwrites.edit(interaction.guildId, {
     VIEW_CHANNEL: false
    });
    channel.permissionOverwrites.edit(server.adminrole, {
     VIEW_CHANNEL: true
    });
    channel.permissionOverwrites.edit("652959577293324288", {
     VIEW_CHANNEL: true
    });
    let mod = db.getModuleS(server, 'words');
    mod.log = channel.id;
    db.updateModuleS(server, mod);
   });
  db.updateModuleS(server, module);

 }
};