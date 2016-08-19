
'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('So you want to learn about MarkyBot? Just say HELLO to get started or HELP to quickly search by topic.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }
            /* getReply should allow for some variety in responses for received text messages that 
do not have an entry in the scripts.json file. */
            function getReply() {
                var messages = [ "Sorry. I'm not configured with a response to your message. Hola Hello.",
                                 "Hey, I didn't understand that. I suggest saying Hello",
                                 "我不明白 - that's Chinese for I do not understand. Yes I can speak Chinese ;)",
                                 "Yo. I do not know what you are talking about. Send me a HELLO",
                                 "You can say that again!",
                                 "You know what they say, don't not take life too seriously. You will never get out of it alive ;)",
                                 "Weather forecast tonight: WINTER IS COMING",
                                 "Life isn’t about getting and having, it’s about giving and being. That shit is DEEP LOL",
                                 "That's interesting. Hhhmmm... I never thought of that. Maybe try Hello",
                                 "Can you say that again?",
                                 "HODOR!...Wait, what did I just say. I'm watching too much TV.",
                                 "Yeah... that happens from time to time. Try Hello.",
                                 "That is a ton of words you just wrote there... I really don't know. Try Hello",
                                ];

                var arrayIndex = Math.floor( Math.random() * messages.length );


                return messages[arrayIndex];
                
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(getReply()).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
