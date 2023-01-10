const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 2097152*2-1 });//all intents >:3

let frontEnd;//websocket

let currentChannel; //channel user is looking at

//--

exports.initialize=function(token){
    return client.login(token);
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

exports.supplyFrontEnd=function(frontEndParam){
    frontEnd=frontEndParam;

    client.guilds.cache.forEach((guild)=>{
        frontEnd.send(JSON.stringify({
            event: "addGuild",
            data: guild
        }));
    });

    client.on("messageCreate", (message)=>{
        if(message.channelId==currentChannel){
            frontEnd.send(JSON.stringify({
                event: "addMessage",
                data: {
                    content: message.content,
                    pfp: message.author!=undefined ?
                        (message.member || message.author).displayAvatarURL() : "none",
                    name: message.member!=undefined ? 
                        message.member.displayName : message.author.username//TODO
                }
            }));
        }
    });

    //--

    frontEnd.on("message",(event)=>{
        let response=JSON.parse(event);

        if(response.requestResponse){
            let toReturn=[];
            switch(response.event){
                case "getGuildChannelsVisual":
                    client.guilds.cache.get(response.data).channels.cache.forEach((channel,key)=>{
                        toReturn.push({
                            name: channel.name,
                            id: channel.id,
                            type: channel.type,
                                switchable: channel.isTextBased(),
                            parentId: channel.parentId,
                            nsfw: channel.nsfw,
                            //flags?
                            rawPosition: channel.rawPosition,
                        });
                    });

                    frontEnd.send(JSON.stringify({
                        responseToRequest: true,
                        sendId: response.sendId,
                        data: toReturn
                    }));
                    break;
                case "getChannelMessagesVisual":
                    let channel = client.channels.cache.get(response.data);
                    currentChannel = response.data;
                    if(!channel.isTextBased()){
                        frontEnd.send(JSON.stringify({
                            responseToRequest: true,
                            sendId: response.sendId,
                            data: {error:"not a text channel"}
                        }));
                        return;
                    }

                    channel.messages.fetch()
                        .then((messages)=>{
                            messages.forEach((message)=>{
                                toReturn.push({
                                    content: message.content,
                                    pfp: message.author!=undefined ?
                                        (message.member || message.author).displayAvatarURL() : "none",
                                    name: message.member!=undefined ? 
                                        message.member.displayName : message.author.username//TODO
                                });
                            });

                            frontEnd.send(JSON.stringify({
                                responseToRequest: true,
                                sendId: response.sendId,
                                data: toReturn
                            }));
                        });
                    break;
                case "askForUser":
                    client.users.fetch(response.data).then((user)=>{
                        frontEnd.send(JSON.stringify({
                            responseToRequest: true,
                            sendId: response.sendId,
                            data: {
                                name: user.username,
                            }
                        }));
                    });
                    break;
            }
        }
    });
}