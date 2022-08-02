export default class Card {
    constructor(){
        this.values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        this.types = ['D','C','S','H'];
        this.deck = [];

        this.init();

    }
    init(){
        this.buildDeck();
    }
    
    /**
     * Construction d'un deck des cartes
     */
    buildDeck(){
        for (let i = 0; i < this.types.length; i++) {
            for (let j = 0; j < this.values.length; j++) {
                this.deck.push(this.values[j] + "-" + this.types[i]);
            }
        }
    }

   /**
    * Random des cartes du deck
    */
    shuffleDeck(){
        for (let i = 0; i < this.deck.length; i++) {
            let randomCards = Math.floor(Math.random() * this.deck.length);
            let temporaryCard = this.deck[i];
            this.deck[i] = this.deck[randomCards];
            this.deck[randomCards] = temporaryCard;   
            return this.deck[i];
        }
    }

    /**
     * Prendre le valeur de chaque carte du deck
     * @param {string} card 
     * @returns {number}
     */
    getValueCard(card){
        let data = card.split("-");
        let value = data[0];
        if(isNaN(value)){
            if(value == "A"){
                return 11;
            }
            return 10;
        }
        return parseInt(value);
    }
 
}