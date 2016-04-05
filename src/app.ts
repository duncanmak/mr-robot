import { createServer } from 'restify';
import { BotConnectorBot } from 'botbuilder';

const appId = process.env['BF_APP_ID'];
const appSecret = process.env['BF_APP_SECRET'];
const bot = new BotConnectorBot({ appId, appSecret });

bot.add('/', (session) => session.send('Hello World'));

const server = createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.get('/hello', (req, res, next) => res.send('Hello World!'));

server.listen(process.env.PORT || 3978, () => console.log('%s listening to %s', server.name, server.url));
