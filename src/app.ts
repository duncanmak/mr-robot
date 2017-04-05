import { createServer } from 'restify';
import { ChatConnector, UniversalBot } from 'botbuilder';

const server = createServer();
server.listen(process.env.PORT || 3978, () => console.log('%s listening to %s', server.name, server.url));

var connector = new ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/',  (session) => session.send("Hello World"));