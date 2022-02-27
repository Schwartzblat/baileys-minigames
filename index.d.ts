export namespace WAMiniGame {
    export class MiniGames {
        private gameMap: object;
        constructor()

        addGameChat(chatId: string, game: MiniGame|Function, message?: proto.IWebMessageInfo, sock?: makeWASocket): boolean

        removeGameChat(chatId: string|MiniGame): boolean
        removeGameChat(game: MiniGame|string): boolean

        forwardMsg(message: proto.IWebMessageInfo, sock: makeWASocket): Promise<void>
    }

    export interface MiniGame {
        _parent: MiniGames
        procMessage(message: proto.IWebMessageInfo, sock?: makeWASocket): Promise<void>

        gameOver(message: proto.IWebMessageInfo, sock?: makeWASocket): void
        setParent(parent: MiniGames): void
    }
}
export namespace proto{
    interface IWebMessageInfo{
        key: {
            remoteJid: string
        }
    }
}
export interface makeWASocket{

}
