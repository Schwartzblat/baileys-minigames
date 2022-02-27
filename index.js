class MiniGames{
  #gameMap;

  constructor() {
    this.#gameMap = {};
  }
  /**
   * @param {string} chatId
   * @param {MiniGame|function} game
   * @param {Message} message
   * @param {makeWASocket} sock
   * @return {boolean}
   */
  addGameChat(chatId, game, message, sock){
    if(this.#gameMap[chatId]){
      return false;
    }
    this.#gameMap[chatId] = {};
    if(typeof game === 'function'){
      game = new game(message, sock);
    }
    this.#gameMap[chatId].game = game;
    game.setParent(this);
    return true;
  }

  /**
   * @param {MiniGame|string} game
   * @return {boolean}
   */
  removeGameChat(game){
    if (typeof game === 'string') {
      if(this.#gameMap[game]) {
        delete this.#gameMap[game];
        return true;
      }
      return false;
    }
    const chatId = Object.keys(this.#gameMap).find(key => this.#gameMap[key].game === game);
    if(this.#gameMap[chatId]) {
      delete this.#gameMap[chatId];
      return true;
    }
    return false;
  }
  /**
   * @param {proto.IWebMessageInfo} message
   * @param {makeWASocket} sock
   * @return {Promise<void>}
   */
  async forwardMsg(message, sock){
    const minigame = this.#gameMap[message.key.remoteJid];
    if (minigame){
      await minigame.game.procMessage(message, sock);
    }
  }
}
class MiniGame{
  #parent;
  /**
   * @param {proto.IWebMessageInfo} message
   * @param {makeWASocket} sock
   * @return {Promise<void>}
   */
  async procMessage(message, sock= undefined){}

  /**
   * @param {proto.IWebMessageInfo} message
   * @param {makeWASocket} sock
   * @return {void}
   */
  gameOver(message, sock=undefined){
    this.#parent.removeGameChat(this);
  }

  /**
   * @param {MiniGames} newParent
   */
  setParent(newParent){
    this.#parent = newParent;
  }

}
module.exports.MiniGames = MiniGames;
module.exports.MiniGame = MiniGame;
