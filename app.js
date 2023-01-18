const botLogic = require("./botLogic");

//--

const fs = require("fs");
const crypto = require("crypto");

//gets cipher key
let cipherKey=undefined;
try{
  cipherKey = Buffer.from(fs.readFileSync("./secrets/.secretkey",{encoding:"base64"}),"base64");
  if(cipherKey.length!=32) throw "wrong length";
}catch{
  cipherKey=crypto.randomBytes(32);
  fs.writeFileSync("./secrets/.secretkey",cipherKey,{encoding:"base64"});
}

//creates ivs (you need them for the crypto stuff)
let oldIv=undefined;
if(fs.existsSync("./secrets/.iv")){
  oldIv=fs.readFileSync("./secrets/.iv");
}
let newIv = crypto.randomBytes(16);

let loginsLoaded=[];
let loginsNoId=[];

function decipher(input){
  let thisDecipher=crypto.createDecipheriv("aes256", cipherKey, oldIv);
  return Buffer.concat([
      thisDecipher.update(input),
      thisDecipher.final()
  ]);
}
function encipher(input){
  let thisEncipher=crypto.createCipheriv("aes256", cipherKey, newIv)
  return Buffer.concat([
      thisEncipher.update(input),
      thisEncipher.final()
  ]);
}

//if there are logins stored, read them
if(fs.existsSync("./secrets/logins.json")){
  let fileData=fs.readFileSync("./secrets/logins.json",{encoding:"utf8"})||"[]";
  loginsLoaded = JSON.parse(fileData);
  loginsNoId = JSON.parse(fileData);
  for(let i=0;i<loginsLoaded.length;i++){
    loginsLoaded[i].token=decipher(Buffer.from(loginsLoaded[i].token,"base64"));
    delete loginsNoId.token;
    delete loginsNoId.id;
  }
}

let loginsToSave=[];
function addLogin(name,id,rawToken,dontWrite){
  for(let i=0;i<loginsToSave.length;i++){
    if(loginsToSave[i].id==id){
      return;
    }
  }

  loginsToSave.push({
    name:name,
    id:id,
    token:encipher(rawToken).toString("base64")
  });

  if(!dontWrite)
    fs.writeFile("./secrets/logins.json",JSON.stringify(loginsToSave,null,2),{encoding:"utf8"},()=>{});
}

for(let i=0;i<loginsLoaded.length;i++){
  addLogin(loginsLoaded[i].name,loginsLoaded[i].id,loginsLoaded[i].token,true);
}

fs.writeFileSync("./secrets/.iv",newIv,{encoding:"base64"});
fs.writeFileSync("./secrets/logins.json",JSON.stringify(loginsToSave,null,2),{encoding:"utf8"});

//--

const { Server } = require('ws');
 
const internalServer = new Server({ port: 3001 });
internalServer.on('connection', (ws) => {
  ws.once("message",(event)=>{
    switch(event.toString()){
      case "frontEnd":
        botLogic.supplyFrontEnd(ws);
        break;
      case "editor":
        botLogic.supplyEditor(ws);
        break;
    }
  });
});

//--

const express = require('express');
const app = express();

app.use(express.static('resources'));

const utils = require('./utils');
const AbstractScene = require('./scenes/AbstractScene').scene;
new AbstractScene(
  "/",
  "Login",
  utils.getTextFile("./scenes/pagedata/Login.html"),
  utils.getTextFile("./scenes/pagedata/Login.js"),
  [["buttons",JSON.stringify(loginsNoId)]]
).register(app);
new AbstractScene(
  "/client",
  "Client",
  utils.getTextFile("./scenes/pagedata/Client.html"),
  utils.getTextFile("./scenes/pagedata/Client.js")
).register(app);
new AbstractScene(
  "/editor",
  "Editor",
  utils.getTextFile("./scenes/pagedata/Editor.html"),
  utils.getTextFile("./scenes/pagedata/Editor.js")
).register(app);

app.get("/login",(req,res)=>{
  if(req.query.id!==undefined){
    req.query.token=loginsLoaded[req.query.id].token.toString();
  }

  botLogic.initialize(req.query.token)
    .then((data)=>{
      addLogin(data.name,data.id,data.token);
      res.redirect("/client");
    },(e)=>{
      let errorMessage="Login error: "+e.code;
      switch(e.code){
        case "TokenInvalid":
          errorMessage="Invalid token";
          break;
      }
      res.redirect("/?error="+errorMessage);
    });
});

app.listen(3000);

//--

console.log("\n"+utils.getTextFile("./welcomeLog.txt"));

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", async function(input) {
  console.log(await commandLineHandler(...input.split(" ")));
});

const open = require('open');
async function commandLineHandler(...input) {
  switch (input[0]) {
    case "help":
      return "" +
        "help: this command\n" +
        "restart (r): restarts the bot, running the most updated code and saving all data\n" +
        "shutdown: shuts the bot down completely, saving all data\n" +
        "sass: recompiles sass\n" + 
        "open (front OR editor): opens the client or the editor, depending on which one you specify";
    case "r":
    case "restart":
      await require('child_process').exec('cmd /c start "" cmd /c start.bat');
      setTimeout(function() {
        process.exit()
      }, 100);
      return "inactive...";
    case "shutdown":
      setTimeout(function() {
        process.exit()
      }, 1000);
      return "shutting down...";
    case "sass":
      await require('child_process').exec('cmd /c start "" cmd /c compile_sass.bat');
      return "recompiled";
    case "open":
      switch(input[1]){
        case "front":
          open("http://localhost:3000/");
          return "opened in browser";
        case "editor":
          open("http://localhost:3000/editor");
          return "opened in browser";
        default:
          return "type \"open front\" or \"open editor\"";
      }
    default:
      return "not a command. type help to see all commands";
  }
  return "something happened. oof";
};

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ');
  console.log(err);
});