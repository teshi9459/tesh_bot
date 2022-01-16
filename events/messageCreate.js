const fs = require('fs');
const db = require('../libs/db');
const tk = require('../libs/ticket');
module.exports = {
 name: 'messageCreate',
 execute(client, message) {

  const ticketFiles = fs.readdirSync(`./DB/${message.guildId}/tickets/`).filter(file => file.endsWith('.json'));
  for (const file of ticketFiles) {
   const ticket = require(`../DB/${message.guildId}/tickets/${file}`);
   if (ticket.channel == message.channel.id) {
    try {
     tk.save(message);
     return;
    } catch (error) {
     console.error(error);
     message.reply('Ein Fehler ist aufgetreten qwq\n*kontaktiere den Developer*');
    }
   }
  }


  if (message.author.bot) return;
  const commandFiles = fs.readdirSync('./message').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
   const mod = require(`../message/${file}`);
   if (fs.existsSync(`./DB/${message.guildId}/modules/${mod.data.id}.json`)) {
    try {
     mod.start(message);
    } catch (error) {
     console.error(error);
     message.reply('Ein Fehler ist aufgetreten qwq\n*kontaktiere den Developer*');
    }
   }
  }
 },
};