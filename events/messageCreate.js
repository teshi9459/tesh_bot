const fs = require('fs');
const db = require('../libs/db');
const tk = require('../libs/ticket');
module.exports = {
 name: 'messageCreate',
 execute(client, message) {
try {
 const ticketFiles = fs.readdirSync(`./DB/${message.guildId}/tickets/`).filter(file => file.endsWith('.json'));
  for (const file of ticketFiles) {
   const ticket = require(`../DB/${message.guildId}/tickets/${file}`);
   if (ticket.channel == message.channel.id) {
    try {
     tk.save(message);
    } catch (error) {
     console.error(error);
     message.reply('Ein Fehler ist aufgetreten qwq\n*kontaktiere den Developer*');
    }
    return;
   }
  }
} catch (e) {}
  
  if (message.author.bot) return;
  const commandFiles = fs.readdirSync('./message/').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
   const modul = require(`../message/${file}`);
   if (fs.existsSync(`./DB/${message.guildId}/modules/${modul.data.id}.json`)) {
    const config = db.getModuleS({
     id: message.guildId
    }, modul.data.id);
    if (!config.enabled) return;
    try {
     modul.start(message);
    } catch (error) {
     console.error(error);
     message.reply('Ein Fehler ist aufgetreten qwq\n*kontaktiere den Developer*');
    }
   }
  }
 },
};