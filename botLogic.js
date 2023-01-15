const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 2097152*2-1 });//all intents >:3

//--

exports.initialize=function(token){
    return client.login(token);
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//--

const {VM, VMScript} = require('vm2');
const codeVM = new VM({
    eval: false,
    sandbox: {
        client: client,
        console: {
            log:function(...args){
                console.log.apply(null,args);
            }
        }
    }
});
let codeEvents={onStart:{}};
let eventNames=[
    "applicationCommandPermissionsUpdate",
    "autoModerationActionExecution",
    "autoModerationRuleCreate",
    "autoModerationRuleDelete",
    "autoModerationRuleUpdate",
    "channelCreate",
    "channelDelete",
    "channelPinsUpdate",
    "channelUpdate",
    "debug",
    "emojiCreate",
    "emojiDelete",
    "emojiUpdate",
    "error",
    "guildBanAdd",
    "guildBanRemove",
    "guildCreate",
    "guildDelete",
    "guildIntegrationsUpdate",
    "guildMemberAdd",
    "guildMemberAvailable",
    "guildMemberRemove",
    "guildMembersChunk",
    "guildMemberUpdate",
    "guildScheduledEventCreate",
    "guildScheduledEventDelete",
    "guildScheduledEventUpdate",
    "guildScheduledEventUserAdd",
    "guildScheduledEventUserRemove",
    "guildUnavailable",
    "guildUpdate",
    "interactionCreate",
    "invalidated",
    "inviteCreate",
    "inviteDelete",
    "messageCreate",
    "messageDelete",
    "messageDeleteBulk",
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveAll",
    "messageReactionRemoveEmoji",
    "messageUpdate",
    "presenceUpdate",
    "ready",
    "roleCreate",
    "roleDelete",
    "roleUpdate",
    "shardDisconnect",
    "shardError",
    "shardReady",
    "shardReconnecting",
    "shardResume",
    "stageInstanceCreate",
    "stageInstanceDelete",
    "stageInstanceUpdate",
    "stickerCreate",
    "stickerDelete",
    "stickerUpdate",
    "threadCreate",
    "threadDelete",
    "threadListSync",
    "threadMembersUpdate",
    "threadMemberUpdate",
    "threadUpdate",
    "typingStart",
    "userUpdate",
    "voiceStateUpdate",
    "warn",
    "webhookUpdate",
];
eventNames.forEach((event)=>{
    codeEvents[event]={};
});

let frontEnds=[];
function addToFrontEnds(frontEnd) {
    var last = 0;
    frontEnds.some(function (_, i) {
        return last < i || !++last;
    });
    frontEnds[last]=frontEnd;
    return last;
}
client.on("messageCreate", (message)=>{
    frontEnds.forEach((frontEnd)=>{
        frontEnd.send(JSON.stringify({
            event: "addMessage",
            data: {
                content: message.content,
                channel: message.channel.id,
                pfp: message.author!=undefined ?
                    (message.member || message.author).displayAvatarURL() : "none",
                name: message.member!=undefined ? 
                    message.member.displayName : message.author.username//TODO
            }
        }));
    });
});
eventNames.forEach((event=>{
    client.on(event, (eventData)=>{
        Object.values(codeEvents[event]).forEach(value => {
            codeVM.sandbox[value.eventVarName]=eventData;
            codeVM.run(value.code);
        });
    });
}));
exports.supplyFrontEnd=function(frontEnd){
    let frontEndIndex=addToFrontEnds(frontEnd);

    client.guilds.cache.forEach((guild)=>{
        frontEnd.send(JSON.stringify({
            event: "addGuild",
            data: guild
        }));
    });
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
                    let channel = client.channels.cache.get(response.data.channel);
                    if(!channel.isTextBased()){
                        frontEnd.send(JSON.stringify({
                            responseToRequest: true,
                            sendId: response.sendId,
                            data: {error:"not a text channel"}
                        }));
                        return;
                    }

                    channel.messages.fetch({
                        before: response.data.before,
                        after: response.data.after
                    }).then((messages)=>{
                            messages.forEach((message)=>{
                                toReturn.push({
                                    content: message.content,
                                    pfp: message.author!=undefined ?
                                        (message.member || message.author).displayAvatarURL() : "none",
                                    name: message.member!=undefined ? 
                                        message.member.displayName : message.author.username,//TODO
                                    id: message.id
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
        }else{
            
        }
    });
    frontEnd.on("close",(event)=>{
        delete frontEnds[frontEndIndex];
    })
}

let mainEditor=null;
const fs = require("fs");
fs.open("./botBlocks.json","w",()=>{});
exports.supplyEditor=function(editor){
    if(mainEditor){
        editor.send("inv client");
        return;
    }

    mainEditor=editor;
    editor.on("message",(event)=>{
        let response=JSON.parse(event);

        switch(response.event){
            case "updateCode":
                console.log(response.data.event)
                codeEvents[response.data.event][response.data.id]={
                    code: new VMScript(response.data.code),
                    eventVarName: response.data.eventVarName
                };
                if(response.data.isFunc){
                    codeVM.run(codeEvents[response.data.event][response.data.id].code);
                }
                break;
            case "deleteBlock":
                delete codeEvents[response.data.event][response.data.id];
                break;
            case "runStart":
                codeVM.run(codeEvents.onStart[response.data.id].code);
                break;
            case "saveJson":
                fs.writeFileSync("./botBlocks.json", JSON.stringify(response.data,null,"    "));
                break;
            case "delayedCodeUpdate":
                editor._events.message(response.data);
                editor.send("next pls");
                break;
            case "load":
                if (fs.existsSync("./botBlocks.json")) {
                  editor.send(JSON.stringify({
                    event: "workspace",
                    data: fs.readFileSync("./botBlocks.json").toString()
                  }));
                } else {
                  editor.send(JSON.stringify({
                    event: "workspace",
                    data: "{}"
                  }));
                }
                break;
        }
    });
    editor.on("close",(event)=>{
        mainEditor=null;
    });
}

//--



//todo: https://github.com/patriksimek/vm2
