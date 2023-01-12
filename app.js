const botLogic = require("./botLogic");

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

  ws.on('close', () => console.log('Client has disconnected!'));
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
  utils.getTextFile("./scenes/pagedata/Login.js")
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
  botLogic.initialize(req.query.token)
    .then((token)=>{
      res.redirect("/client");
    },(e)=>{
      res.redirect("/?error="+"Login-"+e.code);
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
      }, 5000);
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
  console.log('Caught exception: ' + err);
});