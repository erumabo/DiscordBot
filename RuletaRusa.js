const token = require('./RuletaRusa/token.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const help = require('./RuletaRusa/help.json');
const Invite = require('./RuletaRusa/invite.json')
//https://discordapp.com/api/oauth2/authorize?client_id=396772706458140672&scope=bot&permissions=268696640
const Ccolor = 11648530;

var Games = {};
var Players = {};
var PList = [];
var Play = false;
var Pool = 0;
var Round = 6;
var Single = false;
var test;

client.on('ready', () => {
  console.log('Bot en línea');
});

client.on('message', message => {
  command=message.content;
  channell=message.channel.toString();
  if (command.substr(0,2) !== 'r.' && command.substr(0,2) !== 'R.') return;
  args=command.substr(2).split(" ");
  //**Inicio del Switch*//
  switch(args[0]){
    case 'ping': //Clasic Ping Pong
      message.channel.send({embed: { color: Ccolor, title: "Pong" }});
      break;
    case 'pong': //Test of connection
      message.channel.send({embed: { color: Ccolor, title: "Ping" }});
      break;
    case 'help': //Help Message
      message.channel.send( help );
      break;
    case 'bye-bye': //Disconect && Shutdown
      if(message.author.toString() != '<@299355318503211008>'){
        message.reply("Only `The Programer` can shut me down");
      } else {
        message.channel.send({embed: { color: Ccolor, title: "Bye Bye" }})
          .then(message => client.destroy()
            .then(process.exit())
          ).catch(console.error);
      }
      break;
    
    /**Juego**/
    case 'join':
      if(!Games.hasOwnProperty(channell)){
        player = message.author.toString();
        Games[channell]={"Pool": 0, "PList": [], "Play": false, "Players" : {}};
        Games[channell].Players[player]=0;
        message.channel.send('User added');
      } else {
        console.log(channell);
        if(Games[channell].Play){
          message.reply("Game has already started");
        } else {
          player=message.author.toString();
          if(Games[channell].Players.hasOwnProperty(player)){
            message.reply('User already in game.');
          } else {
            Games[channell].Players[player]=0;
            message.channel.send('User added');
          }
        }
      }
      break;
      
    case 'start':
      if(!Games.hasOwnProperty(channell)){
        message.channel.send("Channel "+channell+" has no current game.");
        break;
      } else {
        if(Games[channell].Play){
          message.channel.send('Game has already started');
        } else {
          Games[channell].PList = Object.keys(Games[channell].Players);
          if(Games[channell].PList.length == 0){
            message.channel.send('No players to play with');
          } else {
            for( key in Games[channell].Players ){
              Games[channell].Pool += Games[channell].Players[key];
            }
            message.channel.send({ embed: 
                    { color: Ccolor, title : "Game has started",
                      description : "Players:\n"+Games[channell].PList.join('\n')
                    }});
            /*
            message.channel.send('Game has started\nPlayers:')
              .then(message.channel.send(PList.join('\n')))
              .catch(console.error);
            */
            Games[channell].Play = true;
            Games[channell].Round = 7;
            message.channel.send(Games[channell].PList[0] + " has the gun");
            if(Games[channell].PList.length==1){
              Games[channell].Single = true;
            } else {
              Games[channell].Single = false;
            }
            console.log(Games[channell].PList.length + " " + Games[channell].Single + " " + Games[channell].Round);
          }
        }
      }
      break;
    
    case 'shoot':
      if(!Games.hasOwnProperty(channell)){
        message.channel.send("Channel "+channell+" has no current game.");
        break;
      } else {
      if(Games[channell].Play){
        if(message.author.toString() != Games[channell].PList[0]){
          message.reply("You don't have the gun, it's" + Games[channell].PList[0] + "turn");
        } else {
          Games[channell].Round--;
          console.log(Games[channell].Round);
          test = Math.floor(Math.random()*Games[channell].Round);
          console.log("Shot:" + test);
          if(test==0){
            message.reply("You have killed yourself.");
            message.channel.send(Games[channell].PList[0]+" has left the game.");
            delete Games[channell].Players[Games[channell].PList[0]];
            Games[channell].PList.shift();
            Games[channell].Round = 7;
            if(Games[channell].PList.length==1 && !Games[channell].Single){
              message.channel.send(Games[channell].PList[0] + ", you won");
              Games[channell].Play=false;
              Games[channell].Pool=0;
              delete Games[channell].Players[Games[channell].PList[0]];
              Games[channell].PList.shift();
            }
          } else {
            message.reply("Lucky shot ;)");
            Games[channell].PList.push(Games[channell].PList.shift());
            if(Games[channell].Single && Games[channell].Round == 2){
              message.reply("You won.");
              Games[channell].Play=false;
              Games[channell].Pool=0;
              delete Games[channell].Players[Games[channell].PList[0]];
              Games[channell].PList.shift();
            }
          }
        }
        if(Games[channell].PList.length==0){
          message.channel.send("Game ended.");
          Games[channell].Play = false;
        } else {
          message.channel.send(Games[channell].PList[0] + " has the gun");
        }
        //Add reward
      } else {
        message.channel.send("No game running");
      }}
      break;
      
    case 'bet':
      message.channel.send("Proximamente");
      break;
    
    case 'invite':
      message.channel.send( Invite );
      break;
      
    case 'stop':
      if(!Games.hasOwnProperty(channell)){
        message.channel.send("Channel "+channell+" has no current game.");
        break;
      } else {
        Games[channell].Play = false;
        Games[channell].PList.length = 0;
        for(key in Games[channell].Players) delete Games[channell].Players[key];
        for(key in Games[channell]) delete Games[channell][key];
        delete Games[channell];
      }
      break;
  }
});

client.login(token.token);
