const workspace = Blockly.inject("blocklyArea", {
  toolbox: document.getElementById("toolbox"),
  theme: Blockly.Themes.Zelos,

  theme: Blockly.Theme.defineTheme('dark', {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
      'workspaceBackgroundColour': '#1e1e1e',
      'toolboxBackgroundColour': 'blackBackground',
      'toolboxForegroundColour': '#fff',
      'flyoutBackgroundColour': '#252526',
      'flyoutForegroundColour': '#ccc',
      'flyoutOpacity': 1,
      'scrollbarColour': '#797979',
      'insertionMarkerColour': '#fff',
      'insertionMarkerOpacity': 0.3,
      'scrollbarOpacity': 0.4,
      'cursorColour': '#d0d0d0',
      'blackBackground': '#333'
    },

    'startHats': true,

    'categoryStyles':{
      "discord_category": {
        "colour": "#5865F2"
      },
      "util_category": {
        "colour": "#ff9500"
      },
    },
    'blockStyles':{
      "discord_blocks": {
        "colourPrimary": "#5865F2",
        "colourSecondary":"#454FBF",
        "colourTertiary":"#7289DA"
      },
      "util_blocks": {
        "colourPrimary": "#ff9500",
        "colourSecondary":"#b5761d",
        "colourTertiary":"#ffb366"
      },
    },
  }),
});

//--

const blocklyMeasurer = document.getElementById("blocklyMeasurer");
const blocklyArea = document.getElementById("blocklyArea");
const resize=function(){
  let dims = blocklyMeasurer.getBoundingClientRect();

  blocklyArea.style.left = dims.left + 'px';
  blocklyArea.style.top = dims.top + 'px';
  blocklyArea.style.width = dims.right-dims.left + 'px';
  blocklyArea.style.height = dims.bottom-dims.top + 'px';
  Blockly.svgResize(workspace);
};
window.addEventListener('resize',resize, false);
resize();

//--

let eventBlock={
  "type": "client_onevent",
  "message0": "client on event %1 : %2 %3 %4",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "DISCORD_EVENTS",
      "options": [
        [
          "option",
          "OPTIONNAME"
        ]
      ]
    },
    {
      "type": "field_variable",
      "name": "EVENT_DATA",
      "variable": "event"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "ON_EVENT_FUNC"
    }
  ],
  "tooltip": "Runs when the specified event happens",
  "helpUrl": "https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-applicationCommandPermissionsUpdate",
  "style": "discord_blocks",
};

// https://discord.js.org/#/docs/discord.js/main/class/Client
// #/docs/discord\.js/main/class/Client\?scrollTo=e-([^"]*)
let eventNames=[
  ["application command permissions update","applicationCommandPermissionsUpdate"],
  ["auto moderation action execution","autoModerationActionExecution"],
  ["auto moderation rule create","autoModerationRuleCreate"],
  ["auto moderation rule delete","autoModerationRuleDelete"],
  ["auto moderation rule update","autoModerationRuleUpdate"],
  ["channel create","channelCreate"],
  ["channel delete","channelDelete"],
  ["channel pins update","channelPinsUpdate"],
  ["channel update","channelUpdate"],
  ["debug","debug"],
  ["emoji create","emojiCreate"],
  ["emoji delete","emojiDelete"],
  ["emoji update","emojiUpdate"],
  ["error","error"],
  ["guild ban add","guildBanAdd"],
  ["guild ban remove","guildBanRemove"],
  ["guild create","guildCreate"],
  ["guild delete","guildDelete"],
  ["guild integrations update","guildIntegrationsUpdate"],
  ["guild member add","guildMemberAdd"],
  ["guild member available","guildMemberAvailable"],
  ["guild member remove","guildMemberRemove"],
  ["guild members chunk","guildMembersChunk"],
  ["guild member update","guildMemberUpdate"],
  ["guild scheduled event create","guildScheduledEventCreate"],
  ["guild scheduled event delete","guildScheduledEventDelete"],
  ["guild scheduled event update","guildScheduledEventUpdate"],
  ["guild scheduled event user add","guildScheduledEventUserAdd"],
  ["guild scheduled event user remove","guildScheduledEventUserRemove"],
  ["guild unavailable","guildUnavailable"],
  ["guild update","guildUpdate"],
  ["interaction create","interactionCreate"],
  ["invalidated","invalidated"],
  ["invite create","inviteCreate"],
  ["invite delete","inviteDelete"],
  ["message create","messageCreate"],
  ["message delete","messageDelete"],
  ["message delete bulk","messageDeleteBulk"],
  ["message reaction add","messageReactionAdd"],
  ["message reaction remove","messageReactionRemove"],
  ["message reaction remove all","messageReactionRemoveAll"],
  ["message reaction remove emoji","messageReactionRemoveEmoji"],
  ["message update","messageUpdate"],
  ["presence update","presenceUpdate"],
  ["ready","ready"],
  ["role create","roleCreate"],
  ["role delete","roleDelete"],
  ["role update","roleUpdate"],
  ["shard disconnect","shardDisconnect"],
  ["shard error","shardError"],
  ["shard ready","shardReady"],
  ["shard reconnecting","shardReconnecting"],
  ["shard resume","shardResume"],
  ["stage instance create","stageInstanceCreate"],
  ["stage instance delete","stageInstanceDelete"],
  ["stage instance update","stageInstanceUpdate"],
  ["sticker create","stickerCreate"],
  ["sticker delete","stickerDelete"],
  ["sticker update","stickerUpdate"],
  ["thread create","threadCreate"],
  ["thread delete","threadDelete"],
  ["thread list sync","threadListSync"],
  ["thread members update","threadMembersUpdate"],
  ["thread member update","threadMemberUpdate"],
  ["thread update","threadUpdate"],
  ["typing start","typingStart"],
  ["user update","userUpdate"],
  ["voice state update","voiceStateUpdate"],
  ["warn","warn"],
  ["webhook update","webhookUpdate"]
];
eventBlock.args0[0].options=eventNames;

Blockly.defineBlocksWithJsonArray([
  eventBlock,
  {
    "type": "object_get",
    "message0": "%1 get %2",
    "args0": [
      {
        "type": "input_value",
        "name": "OBJECT"
      },
      {
        "type": "field_input",
        "name": "PROPERTY",
        "text": "property"
      }
    ],
    "output": null,
    "tooltip": "Prints to the console",
    "helpUrl": "",
    "style": "util_blocks",
  },
  {
    "type": "client_globals",
    "message0": "Run on bot start %1 Toggle to run %2 %3 %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "RUN_CHECKBOX",
        "checked": true
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "ONSTART"
      }
    ],
    "tooltip": "This in run whenever the bot is started",
    "helpUrl": "",
    "style": "discord_blocks",
  },
  {
    "type": "custom_js",
    "message0": "run %1",
    "args0": [
      {
        "type": "field_input",
        "name": "TO_RUN",
        "text": "console.log(\"Custom JS\");"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Runs arbitrary JS",
    "helpUrl": "",
    "style": "util_blocks",
  },
  {
  "type": "call_func",
  "message0": "call %1 with %2 %3",
  "args0": [
    {
      "type": "input_value",
      "name": "FUNCTION"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "ARGS",
      "check": "Array"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "tooltip": "Calls the specified function with the specified arguments",
  "helpUrl": "",
  "style": "util_blocks"
}
]);

//--


let code = {onStart:{}};

eventNames.forEach((event)=>{
  code[event[1]]=new Proxy({},{
    set(obj, prop, value) {
      obj[prop]=value;

      internalWebsocket.send(JSON.stringify({
        event: "updateCode",
        data: {
          event:event[1],
          id: prop,
          code: value.code,
          eventVarName: value.eventVarName
        }
      }));
      
      return true;
    },
  });
});

Blockly.JavaScript['client_onevent'] = function(block) {
  var dropdown_discord_events = block.getFieldValue('DISCORD_EVENTS');
  var variable_event_data = block.getFieldValue('EVENT_DATA');
  var statements_on_event_func = Blockly.JavaScript.statementToCode(block, 'ON_EVENT_FUNC');

  //adds the code to a custom string, so that way only the event listeners get send to the server

  let eventVarName=Blockly.JavaScript.nameDB_.getName(variable_event_data, Blockly.VARIABLE_CATEGORY_NAME);
  if(code[dropdown_discord_events][block.id]==undefined ||
    statements_on_event_func != code[dropdown_discord_events][block.id].code ||
    eventVarName != code[dropdown_discord_events][block.id].eventVarName)
    code[dropdown_discord_events][block.id] = {
      code: statements_on_event_func,
      eventVarName: eventVarName
    };

  return `"${dropdown_discord_events}";`;
};
Blockly.JavaScript['client_globals'] = function(block) {
  var statements_onstart = Blockly.JavaScript.statementToCode(block, 'ONSTART');

  if(code.onStart[block.id]==undefined || 
    statements_onstart != code.onStart[block.id].code){
    code.onStart[block.id]={code:statements_onstart};
    internalWebsocket.send(JSON.stringify({
      event: "updateCode",
      data: {
        event: "onStart",
        id: block.id,
        code: statements_onstart,
        eventVarName: ""
      }
    }));
  }
  return `"onstart";`;
};
Blockly.JavaScript['object_get'] = function(block) {
  var value_object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  var text_property = block.getFieldValue('PROPERTY');

  var code = `${value_object||"null"}?.["${text_property}"]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};
Blockly.JavaScript['text_print'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `console.log(${value_text||""})`;
  return code;
};
Blockly.JavaScript['custom_js'] = function(block) {
  var text_to_run = block.getFieldValue('TO_RUN');
  var code = text_to_run+'\n';
  return code;
};
Blockly.JavaScript['call_func'] = function(block) {
  var value_function = Blockly.JavaScript.valueToCode(block, 'FUNCTION', Blockly.JavaScript.ORDER_ATOMIC);
  var value_args = Blockly.JavaScript.valueToCode(block, 'ARGS', Blockly.JavaScript.ORDER_ATOMIC) || [];
  
  var code = `${value_function}(...${value_args})`;
  return code;
};


//--

let internalWebsocket = new WebSocket("ws://localhost:3001");
internalWebsocket.addEventListener('open', (event) => {
  internalWebsocket.send("editor");
});

let lastCode="";
workspace.addChangeListener((event)=>{
  if(event.type==Blockly.Events.BLOCK_DELETE&&
    (event.oldJson.type=="client_onevent"||event.oldJson.type=="client_globals")){
    internalWebsocket.send(JSON.stringify({
      event: "deleteBlock",
      data: {
        event: event.oldJson.type=="client_globals"?"onStart":event.oldJson.fields['DISCORD_EVENTS'],
        id: event.blockId
      }
    }));
  }
  if(event.type==Blockly.Events.BLOCK_CHANGE&&
    workspace.getBlockById(event.blockId).type=="client_onevent"&&
    event.name=="DISCORD_EVENTS"){
    delete code[event.oldValue][event.blockId];
    internalWebsocket.send(JSON.stringify({
      event: "deleteBlock",
      data: {
        event: event.oldValue,
        id: event.blockId
      }
    }));
  }
  if(event.type==Blockly.Events.BLOCK_CHANGE&&
    workspace.getBlockById(event.blockId).type=="client_globals"){
    internalWebsocket.send(JSON.stringify({
      event: "runStart",
      data: {
        id: event.blockId
      }
    }));
  }

  Blockly.JavaScript.workspaceToCode(workspace);
});

//Blockly.serialization.workspaces.save(workspace) 
//saves to json