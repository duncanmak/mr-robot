import { createServer } from 'restify';
import { ChatConnector, IntentDialog, Prompts, UniversalBot } from 'botbuilder';

const server = createServer();
server.listen(process.env.PORT || 3978, () => console.log('%s listening to %s', server.name, server.url));

let connector = new ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

let bot = new UniversalBot(connector);
server.post('/api/messages', connector.listen());

let intents = new IntentDialog();
bot.dialog('/', intents);

intents.matches(/^hello/, [
    (session) => session.beginDialog('/hello')
]);

intents.onDefault([
    (session, args, next) => {
        if (!session.userData.address)
            session.beginDialog("/hello");
        else
            next();
    },
    (session) => {
        session.send("Hello %s", session.userData.address);
    }
]);

bot.dialog('/hello', [
    (session) => {
        let address = JSON.stringify(session.message.address);
        session.userData.address = address;
        session.endDialog();
    }
]);

server.get('/test', (req, res, next) => res.send("This is a test"));