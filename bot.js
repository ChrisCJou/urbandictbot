var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const https = require('https');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 6) == '/urban') {
        var word = message.replace('/urban ','');
        var get_address = "https://api.urbandictionary.com/v0/define?term=" + word;
        console.log(get_address);
        https.get(get_address, (resp) => {
            var data = '';
            resp.on('data', (chunk) => {
                data += chunk;
              });
              resp.on('end', () => {
                console.log(JSON.parse(data).list[0].definition);
                bot.sendMessage({
                    to: channelID,
                    message: "DEFINITION: " + JSON.parse(data).list[0].definition.replace("[","").replace("]", "")
                });
              });
            
            }).on("error", (err) => {
              console.log("Error: " + err.message);
            });

              
        
    }
});