const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 2097152*2-1 });

"INIT TAG"

client.login("TOKEN TAG");

"EVENTS TAG"

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ');
  console.log(err);
});