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