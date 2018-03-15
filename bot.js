const http = require('http');
const apikey = process.env.whetherapi;

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears(['(.*)'],['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  http.get("http://api.openweathermap.org/data/2.5/weather?q=" + message["text"] + "&units=metric&appid=" + apikey, (response) => {
    let buffer = '';
    response.setEncoding('utf8').on('data', (chunk) => {  buffer += chunk;  });
    response.on('end', () => {
      let current = JSON.parse(buffer);
      //都市が見つからなかった場合は404を返す
      if (current["cod"] != "404") {
        bot.reply(message,current["name"] + "の天気は" + current["weather"][0]["main"] + "：気温は" + current["main"]["temp"] + "℃です。");
      }
      else
      {
        bot.reply(message,"都市がみつかりませんでした。");
      }
    });
  });
});

