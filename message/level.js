const db = require('../libs/db');
const dc = require('../libs/dc');
module.exports = {
 data: {
  id: 'level',
  setup: true
 },
 start: function (msg) {
  try {
   const server = db.getServer(msg.guildId);
   let user = db.getUser(server, msg.author.id);
   let chars = db.getChars(server, user);
   const channel = db.getChannels(server);
   let module = db.getModuleS(server, 'level');
   if (module.enabled)
    this.main(msg, server, module, user, chars, channel);
  } catch (e) {
   console.error(e);
  }
 },
 main: function (msg, server, module, user, chars, channel) {},
 setup: function (interaction, server) {
  db.setModuleS(server, {
   id: 'level', enabled: false
  });
  let  module = db.getModuleS(server,
   'level');
  module.min = 10;
  module.index = 1;
  module.txt = 'Neues Level!';
  const category = dc.getChannel(interaction,
   server.category);
  interaction.guild.channels.create("level-log",
   {
    type: "GUILD_TEXT"
   }).then(channel => {
    channel.setParent(category);
    let mod = db.getModuleS(server, 'words');
    mod.log = channel.id;
    db.updateModuleS(server, mod);
   });
  db.updateModuleS(server, module);

 }
};