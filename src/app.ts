import { createServer } from 'restify';
import { BotConnectorBot } from 'botbuilder';

const bot = new BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });

bot.add('/', (session) => session.send('Hello World'));

const server = createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, () => console.log('%s listening to %s', server.name, server.url));

