const fs = require('fs');
const db = require('../libs/db');
module.exports = {
 name: 'messageCreate',
 execute(client, message) {
  if (message.author.bot)return;
  //server
  let server;
  try {
   server = db.getServer(message.guildId);
  } catch (error) {
   message.reply('bitte führe zuerst das setup für den Bot aus');
  }
  //user
  let user;
  try {
   user = db.getUser(server, message.author.id);
  } catch (error) {
   db.setUser(server, message.author);
  }
  if (message.author.bot) return;
  const commandFiles = fs.readdirSync('./module').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
   const command = require(`../module/${file}`);
   if (command.data.setup && fs.existsSync(`./DB/${server.id}/modules/${command.data.id}.json`)) {
    try {
     command.start(message);
    } catch (error) {
     console.error(error);
     message.reply('There was an error while executing this command!');
    }
   }
  }
 },
};