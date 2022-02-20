const db = require ('../libs/db');
const t = require('../libs/tools');
const dc = require('../libs/dc');
const {
 MessageEmbed,
 MessageActionRow,
 MessageButton
} = require('discord.js');
const fs = require('fs');
module.exports = {
 data: {
  id: 'ticket',
  setup: true,
  ongoing: true
 },
 getPannel: function (pannel, interaction) {
  let color;
  let name;
  switch (pannel.typ) {
   case 'support':
    color = '#ffd964';
    name = 'Support';
    break;
   case 'team':
    color = '#fff816';
    name = 'Bewerbung';
    break;
   case 'char':
    color = '#aeefff';
    name = 'Steckbriefe';
    break;
   default:
    color = '#aeefff';
   }
   let Embed = new MessageEmbed()
   .setColor(color)
   .setTitle('Ticket für '+ name)
   .setDescription(pannel.info+'\n\ndrücke auf den Button für ein neues Ticket↓')
   .setFooter(`${interaction.guild.name} | Ticketsystem`, interaction.guild.iconURL());
   return Embed;
  },
  getTicketEmbed: function (ticket, interaction) {
   let color;
   let name;
   let text;
   switch (ticket.typ) {
    case 'support':
     color = '#ffd964';
     name = 'Support';
     text = 'Der Support ist gleich für dich da!\nNenne bitte in Zwischenzeit dein Anliegen und warte dann auf die Antwort eines Team Mitglieds.';
     break;
    case 'team':
     color = '#fff816';
     name = 'Bewerbung';
     text = 'Die Bewerbungen wurde gestartet!\nBitte schicke deine Bewerbung hierherein, ein Admin wird sich dann zeitnahe dieser annehmen. Dieser leitet dich dann weiter durch deine Bewerbung.\nViel Glück';
     break;
    case 'char':
     color = '#aeefff';
     name = 'Steckbrief';
     text = 'Deine Steckbrief Abgabe wurde gestartet!\n1. Schicke bitte deinen Steckbrief in voller Länge hier herein\n2. ping das Team einmal\n3. warte nun auf Antwort und stehe bitte bei Fragen zur Verfügung\n\n*(für das Team: die Commands `/abgabe accept` und `/abgabe reject` stehen zur Verfügung)*';
     break;
   }
   let Embed = new MessageEmbed()
   .setColor(color)
   .setTitle('Ticket für '+ name)
   .setDescription(text)
   .setFooter(`${interaction.guild.name} | Ticketsystem`, interaction.guild.iconURL());
   return Embed;
  },
  button: async function (interaction) {
   const button = interaction.customId;
   const execution = button.split('_')[1].split('@')[0];
   const ticketId = button.split('_')[1].split('@')[1];
   switch (execution) {
    case 'new':
     this.newTicket(interaction);
     break;
    case 'close':
     this.closeTicket(interaction);
     break;
    case 'open':
     break;
    default:
     interaction.reply(execution)
    }
   },
   setup: function (interaction) {
    const server = db.getServer(interaction.guildId);
    let modul = {
     id: 'ticket',
     enabled: true
    };
    interaction.guild.channels.create("tickets log", {
     type: "GUILD_TEXT"
    }).then(channel => {
     channel.setParent(server.category);
     channel.permissionOverwrites.edit(interaction.guildId, {
      VIEW_CHANNEL: false
     });
     channel.permissionOverwrites.edit(server.adminrole, {
      VIEW_CHANNEL: true
     });
     channel.permissionOverwrites.edit("652959577293324288", {
      VIEW_CHANNEL: true
     });
     modul.log = channel.id;
     db.setModuleS(server, modul);
    });
    t.path(`./DB/${server.id}/tickets/pannels/`);
    t.path(`./DB/${server.id}/tickets/closed/`);
    interaction.reply('Erstelle nun mit `/ticket new` ein neues Pannel');
   },
   newPannel: function (interaction) {
    let pannel = {
     category: interaction.options.getChannel('kategorie').id,
     channel: interaction.channel.id,
     message: 0,
     info: interaction.options.getString('info'),
     typ: interaction.options.getString('typ')
    };
    const row = new MessageActionRow()
    .addComponents(
     new MessageButton()
     .setCustomId(`ticket_new@${pannel.channel}`)
     .setLabel('📨 Ticket')
     .setStyle('PRIMARY'));
    interaction.channel.send({
     embeds: [this.getPannel(pannel, interaction)], components: [row]}).then(msg=> {
     pannel.message = msg.id;
     t.setJ(`./DB/${interaction.guildId}/tickets/pannels/${pannel.channel}.json`, pannel);
    });
    interaction.reply({
     content: 'pannel erstellt!', ephemeral: true
    });
   },
   newTicket: function (interaction) {
    const server = db.getServer(interaction.guildId);
    const modul = db.getModuleS(server, 'ticket');
    const pannel = t.getJ(`./DB/${server.id}/tickets/pannels/${interaction.channel.id}.json`);
    let num = 1;
    try {
     const tickets = fs.readdirSync(`./DB/${server.id}/tickets/`).filter(file => file.endsWith('.json'));
     for (const file of tickets) {
      num++;
     }
    } catch (e) {}

    let ticket = {
     id: num,
     user: interaction.member.id,
     typ: pannel.typ
    };
    let name;
    switch (ticket.typ) {
     case 'support':
      name = 'Support';
      break;
     case 'team':
      name = 'Bewerbung';
      break;
     case 'char':
      name = 'Steckbrief';
      break;
    }
    interaction.guild.channels.create('ticket-'+name+'-[' +ticket.id+']', {
     type: "GUILD_TEXT"
   }).then(channel => {
     channel.setParent(pannel.category);
     channel.permissionOverwrites.edit(interaction.guildId, {
      VIEW_CHANNEL: false
     });
     channel.permissionOverwrites.edit(server.adminrole, {
      VIEW_CHANNEL: true
     });
     channel.permissionOverwrites.edit(interaction.member.id, {
      VIEW_CHANNEL: true
     });
     ticket.channel = channel.id;
     const row = new MessageActionRow()
     .addComponents(
      new MessageButton()
      .setCustomId(`ticket_close@${channel.id}`)
      .setLabel('✖️Close')
      .setStyle('DANGER'));

     channel.send({
      content: '<@'+ticket.user+'>',
      embeds: [this.getTicketEmbed(ticket, interaction)],
      components: [row]
     });
     if (ticket.typ === 'char')
      ticket.accepts = [];
     t.setJ(`./DB/${server.id}/tickets/${ticket.channel}.json`, ticket);
     interaction.reply({
      content: 'dein Ticket wurde erstellt <#'+channel.id+'>', ephemeral: true
     });

     let Embed = new MessageEmbed()
     .setColor('#00ff6d')
     .setTitle('Ticket erstellt')
     .setDescription(`<@!${ticket.user}> hat ein Ticket mit dem Typ ${ticket.typ} erstellt.\nDer Ticket-Channel ist <#${ticket.channel}>`)
     .setFooter(`${interaction.guild.name} | Ticketsystem`, interaction.guild.iconURL());
     const log = interaction.guild.channels.cache.find(c => c.id == modul.log);
     log.send({
      embeds: [Embed]});
    });
  },
  closeTicket: function (interaction) {
   const server = db.getServer(interaction.guildId);
   const modul = db.getModuleS(server,
    'ticket');
   const ticket = t.getJ(`./DB/${server.id}/tickets/${interaction.channel.id}.json`);
   const row = new MessageActionRow()
   .addComponents(
    new MessageButton()
    .setCustomId(`ticket_open@${interaction.channel.id}`)
    .setLabel('🛑 open')
    .setStyle('PRIMARY'));

   let Embed = new MessageEmbed()
   .setColor('#ff0000')
   .setTitle('Ticket geschlossen')
   .setDescription(`<@!${interaction.member.id}> hat das Ticket geschlossen.\nDer Channel wird in 5min gelöscht!`)
   .setFooter(`${interaction.guild.name} | Ticketsystem`,
    interaction.guild.iconURL());
   interaction.reply({
    embeds: [Embed],
    components: [row]});
   //open
   let open = false;
   const filter = i => i.customId === `ticket_open@${interaction.channel.id}`;
   console.log(`ticket_open@${interaction.channel.id}`)
   const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 5*60*1000
   });
   collector.on('collect',
    async i => {
     console.log(i.customId);
     if (i.customId === `ticket_open@${interaction.channel.id}`) {
      let Embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Ticket geöffnet')
      .setDescription(`<@!${i.member.id}> hat das Ticket geöffnet.`)
      .setFooter(`${i.guild.name} | Ticketsystem`, i.guild.iconURL());
      i.update({
       embeds: [Embed], components: []});
      open = true;
     }
    });

   collector.on('end',
    collected => {
     if (!open) {
      const saves = this.getFile(ticket, interaction);
      let Embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Ticket geschlossen')
      .setDescription(`<@!${interaction.member.id}> hat das ${ticket.typ}Ticket von <@${ticket.user}> geschlossen.\nDie Konversation wurde gespeichert.`)
      .setFooter(`${interaction.guild.name} | Ticketsystem`, interaction.guild.iconURL());
      const log = interaction.guild.channels.cache.find(c => c.id == modul.log);
      log.send({
       embeds: [Embed], files: saves
      });
      setTimeout(function() {
       interaction.channel.delete();
      }, 5*1000);
     }
    });
  },
  getFile: function (ticket, interaction) {
   let text = `Ticket ${ticket.id} Log\n\n`;
   for (let i = 0; i < ticket.messages.length; i++) {
    text += `${ticket.messages[i].createdAt}>${ticket.messages[i].author.tag}:\n${ticket.messages[i].content}\n`
   }
   fs.writeFileSync(`./DB/${
    interaction.guildId
    }/tickets/${ticket.id}-log.txt`, text, {
     flag: 'a+'
    });
   return [`./DB/${
    interaction.guildId
    }/tickets/${ticket.id}-log.txt`]
  },
  save: function (message) {
   const ticket = t.getJ(`./DB/${message.guildId}/tickets/${message.channel.id}.json`);
   const msg = {
    content: message.content,
    createdAt: message.createdAt,
    author: {
     id: message.author.id,
     tag: message.author.tag
    }
   }
   if (ticket.messages === undefined)
    ticket.messages = [];
   ticket.messages.push(msg);
   t.setJ(`./DB/${message.guildId}/tickets/${message.channel.id}.json`, ticket);
  },
  deletePannel: function(interaction) {
   t.delPath(`./DB/${interaction.guildId}/tickets/pannels/${interaction.channel.id}.json`);
   interaction.reply({
    content: 'gelöscht, lösche bitte das Pannel', ephemeral: true
   })
  }
 };