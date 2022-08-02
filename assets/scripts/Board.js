import Player from "./Player.js";
import Card from "./Card.js";


export default class Board {
    constructor(nbJoueurs) {
        this.elCtas = document.querySelector('[data-js-cta]');
        this.nbJoueurs = +nbJoueurs;
        this.elContainerPlayers = document.getElementById("container-players");
        this.elAccueil = document.getElementById("accueil");
        this.inatif = document.querySelectorAll('joueurInactif');
        this.players = [];
        this.winner = [];
        this.elTotal = document.querySelector('[data-js-total]');
        this.isGameOver = false;
        this.nbParties = 0;

        this.init();
    }

    init() {

        /**
         * Injecte new Player
         */
        for (let i = 0; i < this.nbJoueurs; i++) {
            let player = new Player(i);
            this.injectDOM(player);
            this.players.push(player);
        }
        this.setButtons();
    }

    setButtons() {
        /**
         * Comportements des buttons play et stop
         */
        let elCard = document.querySelector('[data-js-card]');
        let elBtns = document.querySelectorAll('[data-js-btn]');

        for (let i = 0; i < elBtns.length; i++) {
            elBtns[i].addEventListener('click', function (e) {
                let btnName = e.target.dataset.jsBtn;
                const btnIdPlay = e.target.dataset.idPlay;
                const btnIdStop = e.target.dataset.idStop;
                let card = new Card;
                let shuffleCard = card.shuffleDeck()
                let cardValue = card.getValueCard(shuffleCard);
                const target = e.target.parentElement.parentElement;
                let span = target.querySelector('span');

                const currentPlayerPlay = this.players.find(function ({ id }) {
                    return id === +btnIdPlay;
                });
                const currentPlayerStop = this.players.find(function ({ id }) {
                    return id === +btnIdStop;
                });

                // l'instance du btn play
                if (btnName == 'play') {
                    this.nbParties = this.nbParties + 1;
                    const currentValue = +span.innerText;
                    const valueUpdated = cardValue + currentValue;
                    span.innerText = valueUpdated;
                    currentPlayerPlay.points = valueUpdated;

                    if (currentPlayerPlay.id <= this.players.length) {

                        const isLastPlayer = this.checkIfIsLastPlayer();

                       // verifier si le joueur n'est depasse de 21 points
                        if (span.innerText > 21) {
                            target.classList.add('outOfGame');
                            let elText = target.querySelector('p');
                            elText.innerText = "You are out of the game!"
                            currentPlayerPlay.hasFinished = true;
                            currentPlayerPlay.isPlaying = false;
                            this.checkIfGameIsOver();
                        }
                        
                        const nextSibling = target.nextElementSibling;

                        if (nextSibling && !isLastPlayer) {
                            target.classList.add('inactive');
                            nextSibling.classList.remove('inactive');
                        }
                        if(!nextSibling && !isLastPlayer) {
                            
                            target.classList.add('inactive');
                        
                            const allCards = document.querySelectorAll('.card');
                            const onlyActiveCards = [...allCards].filter(function(card) {
                                const hasInactiveStop = card.classList.contains('inactiveStop');
                                const hasOutOfGame = card.classList.contains('outOfGame');
                                return  !hasInactiveStop && !hasOutOfGame
                            
                            })

                            const elNextCardActive = document.getElementById(onlyActiveCards[0].id);
                            elNextCardActive.classList.remove('inactive');
                        }
                        if(isLastPlayer){
                            this.checkIfGameIsOver();
                        }
                        
                    }

                }
                // l'instance du btn stop
                else if (btnName == 'stop') {
                    this.nbParties = this.nbParties + 1;

                    currentPlayerStop.hasFinished = true;
                    target.classList.add('inactiveStop');
                    let elText = target.querySelector('p');
                    elText.innerText = "You are stopped!"
                    const isLastPlayer = this.checkIfIsLastPlayer();
                    const nextSibling = target.nextElementSibling;
                    this.checkIfGameIsOver()

                    if (this.isGameOver) return

                    if (nextSibling && isLastPlayer) {
                        const { id } = this.players.find(function({hasFinished}) {
                            return !hasFinished;
                        })
                        const elNextCardActive = document.getElementById(id);
                        elNextCardActive.classList.remove('inactive');
                    }

                    if (nextSibling && !isLastPlayer) {
                        const hasClassInactive = nextSibling.classList;
                        if([...hasClassInactive].includes('inactive')){
                            nextSibling.classList.remove('inactive');
                        }
                    }

                    if(!nextSibling && !isLastPlayer) {
                        const { id } = this.nextPlayerActive();
                        console.log(id);
                        const elNextCardActive = document.getElementById(id);
                        elNextCardActive.classList.remove('inactive');
                        this.checkIfGameIsOver();
                    }

                    if(!nextSibling && isLastPlayer) {
                        const { id } = this.nextPlayerActive();
                        const elNextCardActive = document.getElementById(id);
                        elNextCardActive.classList.remove('inactive');
                        this.checkIfGameIsOver();

                    }
                }
                this.checkIfGameIsOver();
            }.bind(this));
        }

    }
    /**
     * Cherche si il y a des joueurs actifs
     *  
     */
    nextPlayerActive() {
        const onlyActivePlayers = this.players.filter(function ({ hasFinished }) {
            return !hasFinished;
        });

        for (let i = 0; i < onlyActivePlayers.length; i++) {
            let firstActivePlayer = onlyActivePlayers.find(function ({ id }) {
                return id ;
            })
            return firstActivePlayer;
        }
    }

    /**
     * Verifie si est le dernier joueur
     * @returns boolean
     */
    checkIfIsLastPlayer(){
        const totalPlayers = this.players.length;
        const nbPlayersFinished = this.players
        .map(function( { hasFinished }){
            return hasFinished;
        })
        .filter(function(hasFinished){
            return hasFinished;
        }).length;
        return (totalPlayers - 1) === nbPlayersFinished;
    }


    checkIfGameIsOver() {
        this.isGameOver = this.players 
            .map(function ({ hasFinished }) {
                return hasFinished;
            }) 
            .every(function (currentValue) {
                return currentValue;
            })
            
        if (this.isGameOver) {
            this.showTheWinner();
            // faire apparaitre le btn por faire le reload de la page
           const newGameBtn = document.getElementById('new-game');
           const nbParties = document.getElementById('partieJoue');
           const nbPartiesJoue = `Parties Joués: ${this.nbParties}`;
           nbParties.insertAdjacentHTML('afterbegin', nbPartiesJoue);
           sessionStorage.getItem('parties');
           sessionStorage.setItem('parties', nbPartiesJoue);
           newGameBtn.classList.remove('hide');
           newGameBtn.addEventListener('click', function() {
            location.reload(true);
           })
        }

    }

    showTheWinner() {
        const winners = this.getWinners();

        winners.forEach(function ({ id }) {
            const cardWinner = document.getElementById(id);
            let p = cardWinner.querySelector('p');
            p.innerText = "WINNER! 🏆"
            cardWinner.classList.add('winner');
        });

    }

    getWinners() {
        const pointsMapping =  this.players
            .filter(function({ points }) {
                return points <= 21
            })
            .map(function ({ points }) {
                return points
            })

        const playerMaxPoints = Math.max(...pointsMapping);

        const winners = this.players.filter(function ({ points }) {
            return points == playerMaxPoints;
        });
        return winners;

    }

    /**
     * Injection du player au DOM
     * @param {*} player 
     */
    injectDOM(player) {

        let cardDom = `
        
            <div class="card ${player.id === 1 ? '' : 'inactive'}" id="${player.id}">
                <h2>Joueur ${player.id} </h2>
                <h3>Total: 
                    <span>${player.points}</span>
                </h3>
                <p></p>
                <div class="button">
                        <button data-id-play="${player.id}" data-js-btn="play">Play</button>
                        <button data-id-stop="${player.id}" data-js-btn="stop">Stop</button>
                </div>
            </div>
        
        `;

        this.elContainerPlayers.insertAdjacentHTML('beforeend', cardDom);
        this.elAccueil.classList.add('hide');

    }

}