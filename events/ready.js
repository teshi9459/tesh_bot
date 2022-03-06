const fs = require('fs');
module.exports = {
 name: 'ready',
 once: true,
 execute(client) {
  const guilds = client.guilds.cache.map(guild => guild.name);
  console.log(`online as ${client.user.tag}\non ${guilds}`);
  client.user.setPresence({
   activities: [{
    name: 'mit RPern auf '+guilds.length+' Servern'
   }], status: 'online'
  });
 },
};