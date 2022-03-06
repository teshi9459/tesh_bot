const fs = require('fs');
const tk = require('../exports/slash/ticket');
module.exports = {
 name: 'interactionCreate',
 async execute(client, interaction) {
  if (!interaction.isButton()) return;
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an Buttoninteraction (${interaction.customId}).`);
  if (!interaction.customId.includes('ticket')) return;
  try {
   await tk.button(interaction);
  } catch (error) {
   console.error(error);
  }
 },
};