 wa-minigames
A module that helps you to create minigames with <a href="https://github.com/pedroslopez/whatsapp-web.js" target="_blank">whatsapp-web.js</a>.
## Installation

```console
npm install whatsapp-web.js
npm install wa-minigames
```
## Example Usage

```js
const {default: makeWASocket, makeInMemoryStore, useSingleFileAuthState, DisconnectReason} = require('@adiwajshing/baileys');
const {Boom} = require('@hapi/boom');
const P = require('pino');
const { MiniGames, MiniGame } = require('index.js');

class MyGame extends MiniGame {
    constructor(message, sock){
        super();
        this.sock = sock;
        this.chatId = message.key.remoteJid;
        this.answer = Math.floor(Math.random() * 10).toString();
        this.sock.sendMessage(this.chatId, {text: "Game Started! Guess the number!"});
    }
    async procMessage(message){
        if (message.body===this.answer){
            await this.sock.sendMessage(this.chatId, {text: 'You are right!'});
            this.gameOver();
        }else if (!message.fromMe){
            await this.sock.sendMessage(this.chatId, {text: 'You are wrong.'});
        }
    }
    gameOver(){
        super.gameOver();
        this.socket.sendMessage(this.chatId, {text: 'Game Over!'});
    }
}

const store = makeInMemoryStore({ logger: P().child({ level: 'fatal', stream: 'store'}) });
store.readFromFile('baileys_store_multi.json');
setInterval(() => {
    store.writeToFile('baileys_store_multi.json');
}, 10_000)

const { state, saveState } = useSingleFileAuthState('auth_info_multi.json')
const miniGames = new MiniGames();
// start a connection
const startSock = () => {
    const sock = makeWASocket({
        logger: P({ level: 'fatal' }),
        printQRInTerminal: true,
        auth: state
    })
    store.bind(sock.ev)

    sock.ev.on('messages.upsert', m => {
        const message = m.messages[0]
        message.body = message?.message?.conversation || message?.message?.extendedTextMessage?.text
            || message?.message?.imageMessage?.caption|| message?.message?.videoMessage?.caption;
        miniGames.forwardMsg(message, sock);
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            if((new Boom(lastDisconnect.error))?.output?.statusCode !== DisconnectReason.loggedOut) {
                startSock()
            }
        }
    })
    sock.ev.on('creds.update', saveState)
    return sock
}

startSock()

```
