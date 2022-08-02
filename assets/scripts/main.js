import Board from "./Board.js";

let elButton = document.querySelector('[data-js-button]');
let elInputNb = document.getElementById("nbPlayers");


elButton.addEventListener('click', function(e){
    e.preventDefault;
    const nbJoueurs = elInputNb.value;
    new Board(nbJoueurs);

    elInputNb.value = "";

});