
let eventBlock={
  "type": "client_onevent",
  "message0": "client on event %1 : event %2 %3 %4",
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
      "name": "EVENT_DATA"
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
  "helpUrl": "https://discord.js.org/#/docs/discord.js/main/class/Client",
  "extensions": ["client_onevent_extension"],
  "style": "discord_blocks",
};
Blockly.Extensions.register(
  "client_onevent_extension",
  function() {
    let thisBlock = this;
    this.setHelpUrl(function() {
      return "https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-"+
        thisBlock.getFieldValue("DISCORD_EVENTS")
    });
  });

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

Blockly.Blocks["object_get"] = {
  init: function(){
    this.appendValueInput("OBJECT");
    this.appendDummyInput("PROPS").appendField("get");

    this.setStyle("util_blocks");
    this.setInputsInline(true);
    this.propCount = 1;
    this.updateShape_();
    this.setOutput(true);
    this.setTooltip("Gets the object's specified property");

    this.setOnChange(function(changeEvent) {
      if(changeEvent.type!="change") return;

      this.updateShape_();
    });
  },

  saveExtraState: function() {
    let props=[];
    for (let i = 0; i < this.propCount; i++) {
      props[i]=this.getFieldValue("PROP"+i);
    }

    return {
      props: props
    };
  },
  loadExtraState: function(state) {
    this.propCount = state.props.length;
    this.tempProps = state.props;
    this.updateShape_();
  },

  updateShape_: function() {
    //if propcount is 2, it ends up at 1
    if(this.propCount==0) this.propCount=1;

    const propRow=this.getInput("PROPS");

    for (let i = 0; i < this.propCount; i++) {
      let currProp=this.getField("PROP"+i);
      if (!currProp) {
        propRow.appendField(new Blockly.FieldTextInput(this?.tempProps?.[i]||""),"PROP"+i);
      }else if(i==this.propCount-1&&this.getFieldValue("PROP"+i)!=""&&this.propCount<10){
        this.propCount++;
      }else{
        while(i==this.propCount-2&&(this.getFieldValue("PROP"+i)==""||i==0)&&this.getFieldValue("PROP"+(i+1))==""&&this.propCount>1){
          this.propCount--;
          propRow.removeField("PROP"+(i+1));
          i--;
        }
      }
    }
    
    for (let i = this.propCount; this.getField("PROP"+i); i++) {
      propRow.removeField("PROP"+i);
    }
    delete this.tempProps;
  },
};

//https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-
Blockly.defineBlocksWithJsonArray([
  eventBlock,
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
  },

  //mutators

]);

//--


let code = {onStart:{}};

eventNames.forEach((event)=>{
  code[event[1]]=new Proxy({},{
    set(obj, prop, value) {
      obj[prop]=value;

      wsSend(JSON.stringify({
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
    eventVarName != code[dropdown_discord_events][block.id].eventVarName){
    code[dropdown_discord_events][block.id] = {
      code: statements_on_event_func,
      eventVarName: eventVarName
    };
  }

  return `"${dropdown_discord_events}";`;
};
Blockly.JavaScript['client_globals'] = function(block) {
  var statements_onstart = Blockly.JavaScript.statementToCode(block, 'ONSTART');

  if(code.onStart[block.id]==undefined || 
    statements_onstart != code.onStart[block.id].code){
    code.onStart[block.id]={code:statements_onstart};
    wsSend(JSON.stringify({
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
  var code=value_object;
  for(let i=0;i<this.propCount;i++){
    let value=block.getFieldValue('PROP'+i);
    if(value=="") continue;
    code+=`?.["${value}"]`;
  }

  return [code, Blockly.JavaScript.ORDER_MEMBER];
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


Blockly.JavaScript['text_print'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `console.log(${value_text||""});\n`;
  return code;
};
let origProcedure = Blockly.JavaScript['procedures_defreturn'];
Blockly.JavaScript['procedures_defreturn'] = function(block) {
  origProcedure(block);

  const funcCode = Blockly.JavaScript.definitions_['%' + 
    Blockly.JavaScript.nameDB_.db.get(Blockly.Names.NameType.PROCEDURE).get(block.getFieldValue('NAME'))];

  if(code.onStart[block.id]==undefined || 
    funcCode != code.onStart[block.id].code){
    code.onStart[block.id]={code:funcCode};
    wsSend(JSON.stringify({
      event: "updateCode",
      data: {
        event: "onStart",
        id: block.id,
        isFunc: true,
        code: funcCode,
        eventVarName: ""
      }
    }));
  }
  return null;
};
Blockly.JavaScript['procedures_defnoreturn'] = Blockly.JavaScript['procedures_defreturn'];

//--

function returnButton(text,onClick,classes,data){
  return class extends Blockly.ToolboxItem{
    constructor(separatorDef, toolbox) {
      super(separatorDef, toolbox);

      this.htmlDiv_ = null;

      this.buttonData={};
      if(data){
        Object.keys(data).forEach((key)=>{
          this.buttonData[key]=data[key];
        });
      }
    }

    init() {
      this.createDom_();
    }
    createDom_() {
      const container = document.createElement('div');
      let tempThis=this;
      container.addEventListener("click",()=>{
        onClick.call(this);
      });
      container.innerText=text;
      Blockly.utils.dom.addClass(container, "toolbarButton");
      classes.forEach((className)=>{
        Blockly.utils.dom.addClass(container, className);
      });
      this.htmlDiv_ = container;
      return container;
    }
    getDiv() {
      return this.htmlDiv_;
    }
    dispose() {
      Blockly.utils.dom.removeNode(this.htmlDiv_);
    }
  }
}
Blockly.Css.register(`
.toolbarButton{
  margin: 5px;
  padding: 0 10px;
  border-radius: 5px;
  font-weight: bold;

  cursor: pointer;
}
.toolbarButton:hover{
  opacity: 0.8;
}
.blocklyToolboxDiv[layout="h"] .toolbarButton {
  /*todo, untested*/
  right: 0;
}
`);

let frozenDom = null;
let isCurrentlyFrozen=false;

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  "saveButton",
  returnButton("Save",(event)=>{
    if(confirm("Do you want to save? (Overwrites previous data)")){
      wsSend(JSON.stringify({
        event: "saveJson",
        data: Blockly.serialization.workspaces.save(workspace)
      }));
    }
  },
  ["saveButton"]
));
Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  "freezeButton",
  returnButton("Freeze",async function(event){
    this.buttonData.frozen=!this.buttonData.frozen;
    if(this.buttonData.frozen){
      this.htmlDiv_.innerText="Unfreeze";
      this.htmlDiv_.style['background-color']="#4c4599";
      document.getElementById("blocklyMeasurer").style['opacity']=0.1;
      frozenDom = Blockly.serialization.workspaces.save(workspace);
      isCurrentlyFrozen=true;

      Blockly.getMainWorkspace().getToolbox().contents_
        .find((element)=>element.toolboxItemDef_.kind=="REVERTBUTTON")
        .htmlDiv_.style['display'] = "initial";
    }else{
      if(this.buttonData.unfreezing) return;
      this.buttonData.unfreezing=true;

      this.htmlDiv_.innerText="Freeze";
      this.htmlDiv_.style['background-color']="";

      Blockly.getMainWorkspace().getToolbox().contents_
        .find((element)=>element.toolboxItemDef_.kind=="REVERTBUTTON")
        .htmlDiv_.style['display'] = "none";

      for(let i=0;i<toSendQueue.length;i++){
        internalWebsocket.send(JSON.stringify({
          event:"delayedCodeUpdate",
          data:toSendQueue[i]
        }));

        await new Promise((resolve)=>{
          nextMessageResolver=resolve;
        });
      }
      toSendQueue=[];
      isCurrentlyFrozen=false;
      this.buttonData.unfreezing=false;
      document.getElementById("blocklyMeasurer").style['opacity']=0;
      frozenDom = null;
    }
  },
  ["freezeButton"],
  { frozen: false, unfreezing: false }
));
Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  "revertButton",
  returnButton("Revert",function(event){
    toSendQueue=[];

    Blockly.serialization.workspaces.load(frozenDom, workspace);
    document.querySelector(".freezeButton").click();
    this.htmlDiv_.style['display'] = "none";
  },
  ["revertButton"]
));
Blockly.Css.register(`
.saveButton {
  background-color: #b1c951;
}
.freezeButton {
  background-color: #68a0e3;
}
.revertButton{
  background-color: #e3345a;
  display: none;
}
`);

//--

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

let internalWebsocket = new WebSocket("ws://localhost:3001");
internalWebsocket.addEventListener('open', (event) => {
  internalWebsocket.send("editor");
  internalWebsocket.send(JSON.stringify({event:"load"}));
});
internalWebsocket.addEventListener("message",(event)=>{
  let response = event.data.toString();
  if(response=="next pls"){
    nextMessageResolver();
    return;
  }
  if(response=="inv client"){
    location.replace("/?error=Only one editor allowed");
    return;
  }
  if(response=="login"){
    location.replace("/?error=Not logged in");
    return;
  }

  response=JSON.parse(response);
  if(response.event=="workspace"){
    Blockly.serialization.workspaces.load(JSON.parse(response.data), workspace);
  }
});

let toSendQueue=[];
let nextMessageResolver=null;
function wsSend(data){
  if(isCurrentlyFrozen){
    toSendQueue.push(data);
  }else{
    internalWebsocket.send(data);
  }
}

let lastCode="";
workspace.addChangeListener((event)=>{
  if(event.type==Blockly.Events.BLOCK_DELETE&&
    (event.oldJson.type=="client_onevent"||event.oldJson.type=="client_globals")){
    wsSend(JSON.stringify({
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
    wsSend(JSON.stringify({
      event: "deleteBlock",
      data: {
        event: event.oldValue,
        id: event.blockId
      }
    }));
  }
  if(event.type==Blockly.Events.BLOCK_CHANGE&&
    workspace.getBlockById(event.blockId).type=="client_globals"){
    wsSend(JSON.stringify({
      event: "runStart",
      data: {
        id: event.blockId
      }
    }));
  }

  Blockly.JavaScript.workspaceToCode(workspace);
});