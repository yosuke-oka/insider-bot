import * as Botkit from 'botkit'
import { difference, shuffle, sample } from 'lodash'

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

// TODO 取得
const botUserId = 'U8K7GB6M8'

const controller = Botkit.slackbot({})

const bot = controller.spawn({
    token: process.env.TOKEN
}).startRTM()


controller.hears(['ping'], 'direct_message, direct_mention, mention', (bot, message) => {
    bot.reply(message, 'pong')
})

// todo: async/await
controller.hears(['game init'], 'mention, direct_mention', (bot, message) => {
    bot.api.channels.info({ channel: 'C8JMND865' }, (err, response) => {
        const userIds: string[] = shuffle(difference(response.channel.members, [botUserId])) // bot自身を除きたい
        const players = initializePlayers(userIds)
        players.forEach(p => {
            bot.startPrivateConversation({ user: p.userId }, (err, convo) => {
                if (!err && convo) {
                    convo.say(p.role)
                    if (p.answer) convo.say(p.answer)
                }
            })
        })
    })
})


interface Player {
    userId: string
    role: string //'commons' | 'master' | 'insider'
    answer?: string
}

const initializePlayers = (userIds: string[]): Player[] => {
    const answer = sample(['お正月', 'ハッカソン', '忘年会'])
    const master = { userId: userIds[0], role: 'master', answer: answer }
    const insider = { userId: userIds[1], role: 'insider', answer: answer }
    const commons = userIds.slice(2).map(id => (
        { userId: id, role: 'commons' }
    ))
    return commons.concat([master, insider])
}
