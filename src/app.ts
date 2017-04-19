import { createServer } from 'restify';
import { ChatConnector, IEvent, IntentDialog, Message, Prompts, UniversalBot } from 'botbuilder';

const server = createServer();
server.listen(process.env.PORT || 3978, () => console.log('%s listening to %s', server.name, server.url));

let connector = new ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

let bot = new UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.on('installationUpdate', (activity: IEvent) => {
    let token = activity.sourceEvent.token;
    
    let message = new Message()
        .address(activity.address)
        .text(token);

    bot.send(message);
});

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