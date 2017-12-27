import * as Botkit from 'botkit'

declare let process: {
    env: {
        TOKEN: string;
    }
    exit(status?: number): never
}

if (!process.env.TOKEN) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}

const controller = Botkit.slackbot({})

const bot = controller.spawn({
    token: process.env.TOKEN
}).startRTM()

controller.hears(['ping'], 'direct_message, direct_mention, mention', (bot, message) => {
    bot.reply(message, 'pong')
})

// todo: async/await
controller.hears(['game init'], 'mention, direct_mention', (bot, message) => {
    bot.api.channels.info({channel: 'C8JMND865'}, (err, response) => {
        
        console.log(response.channel.members)
        const players: [string] = response.channel.members
        players.forEach(p => {
            bot.startPrivateConversation({user: p}, (err, convo) => {
                if (!err && convo) {
                    convo.say('hogehoge')
                }
            })
        });
    })
})



