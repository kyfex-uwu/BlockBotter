const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 2097152*2-1 });



client.login("OTQzNjc3NDUwMjI1ODUyNDY2.GZ0uZ_.QnohSQHyfp0WSDFtBuVA2q631oO18sKxEaHptI");

client.on('messageCreate',(event2)=>{
     if (event2?.["author"]?.["id"] != event2?.["client"]?.["user"]?.["id"]) {
    if (event2?.["content"].slice(0, 2) == 'k!') {
      (event2?.["channel"]?.["send"])(...['command used, but idk what yet uwu'])}
  }

});


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ');
  console.log(err);
});