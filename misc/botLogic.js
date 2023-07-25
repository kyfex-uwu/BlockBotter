const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: 2097152*2-1 });//all intents >:3

//--

let onReady=undefined;

exports.initialize=function(token){
    return new Promise((resolve,reject)=>{
        onReady=resolve;

        client.login(token).then(()=>{},reject);
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    onReady({
        name: client.user.username,
        id: client.user.id,
        token:client.token
    });
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
            try{
                codeVM.run(value.code);
            }catch(error){
                console.log("BlockBotter error:");
                console.log(error);
                console.log(value.code._code);
            }
        });
    });
}));
exports.supplyFrontEnd=function(frontEnd){
    if(!client.user){
        frontEnd.send("login");
        return;
    }

    let frontEndIndex=addToFrontEnds(frontEnd);

    client.guilds.cache.forEach((guild)=>{
        frontEnd.send(JSON.stringify({
            event: "addGuild",
            data: guild
        }));
    });
    frontEnd.on("message",(event)=>{
        let request=JSON.parse(event);

        if(request.requestResponse){
            let toReturn=[];
            switch(request.event){
                case "getGuildChannelsVisual":
                    client.guilds.cache.get(request.data).channels.cache.forEach((channel,key)=>{
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
                        sendId: request.sendId,
                        data: toReturn
                    }));
                    break;
                case "getChannelMessagesVisual":
                    let channel = client.channels.cache.get(request.data.channel);
                    if(!channel.isTextBased()){
                        frontEnd.send(JSON.stringify({
                            responseToRequest: true,
                            sendId: request.sendId,
                            data: {error:"not a text channel"}
                        }));
                        return;
                    }

                    channel.messages.fetch({
                        before: request.data.before,
                        after: request.data.after
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
                                sendId: request.sendId,
                                data: toReturn
                            }));
                        });
                    break;
                case "askForUser":
                    client.users.fetch(request.data).then((user)=>{
                        frontEnd.send(JSON.stringify({
                            responseToRequest: true,
                            sendId: request.sendId,
                            data: {
                                name: user.username,
                            }
                        }));
                    });
                    break;
                case "sendMessage":
                    client.channels.fetch(request.data.channel)
                        .then(channel=>channel.send(request.data.message))
                        .then(message=>{
                            frontEnd.send(JSON.stringify({
                                responseToRequest: true,
                                sendId: request.sendId,
                                data: { sent:true }
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

//--

let packageJson={
  "author": "BlockBotter User",
  "description": "descriptionhere",
  "version": "1.0.0",

  "main": "bot.js",
  "dependencies": {
    "discord.js": "^14.7.1"
  }
};
// npm install discord.js@14.7.1

let mainEditor=null;
const fs = require("fs");
if(!fs.existsSync("./misc/botBlocks.json")){
    fs.writeFileSync("./misc/botBlocks.json","");
}
const botTemplate = fs.readFileSync("./misc/botTemplate.js").toString();

const offline=false;
const childProcess = require("child_process");
exports.supplyEditor=function(editor){
    if(!client.user&&!offline){
        editor.send("login");
        return;
    }
    if(mainEditor){
        editor.send("inv client");
        return;
    }

    mainEditor=editor;
    editor.on("message",(event)=>{
        let response=JSON.parse(event);

        switch(response.event){
            case "updateCode":
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
                fs.writeFileSync("./misc/botBlocks.json", JSON.stringify(response.data,null,"  "));
                break;
            case "delayedCodeUpdate":
                editor._events.message(response.data);
                editor.send("next pls");
                break;
            case "load":
                if (fs.existsSync("./misc/botBlocks.json")) {
                  editor.send(JSON.stringify({
                    event: "workspace",
                    data: fs.readFileSync("./misc/botBlocks.json").toString()
                  }));
                }
                break;
        }
    });
    editor.on("close",(event)=>{
        mainEditor=null;
    });
}

function exportToBot(){
    fs.writeFileSync("./exported/package.json",JSON.stringify(Object.assign({
        author: client.user.username,
        //todo lol
    },packageJson),null,2));

    let code=botTemplate.replace("TOKEN TAG",client.token);

    let initCode="";
    let eventCode="";
    Object.entries(codeEvents).forEach((category)=>{
        let name=category[0];
        let eventCategory=category[1];

        if(Object.keys(eventCategory).length==0) return;

        if(name=="onStart"){
            Object.values(eventCategory).forEach((event)=>{
                initCode+=event.code._code+"\n";
            });
        }else{
            Object.values(eventCategory).forEach((event)=>{
                eventCode+=`client.on('${name}',(${event.eventVarName})=>{\n`+
                "   "+event.code._code+"\n"+
                `});\n`;
                console.log("added")
            });
                console.log("done")
        }
    });
    code=code
        .replace("\"INIT TAG\"",initCode)
        .replace("\"EVENTS TAG\"",eventCode);

    fs.writeFileSync("./exported/bot.js",code);

    if(!fs.existsSync("./exported/node_modules")){
        childProcess.exec('cmd /c start /min misc\\exportInit.bat');
    }
}