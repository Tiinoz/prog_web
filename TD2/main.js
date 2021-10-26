const val = ["2", "3", "4", "5", "6", "7", "8","9", "10", "J", "Q", "K", "A"];
const suits = ["s", "h", "d", "c"];

let player;
let dealer;

let w = 0;
let d = 0;
let l = 0;

let gameStart = false;

let deck = [];

let deal = 10;

function createDeck(d){
    for (let i = 0; i < suits.length; i++) {
        for (let y = 0; y < val.length; y++) {
            d.push(`${val[y]} ${suits[i]}`)
            
        }
    }
    shuffleDeck(d);
}

function shuffleDeck(d)
{
    for (let i = d.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
}

function initGame(){
    if (gameStart === false){
        player = new Player("player", 100);
        dealer = new Player("dealer", 1000);
        gameStart = true;
    }
    createDeck(deck);
    viewMoney();

    let tmp = document.querySelectorAll(".hidden");
    for (let i = 0; i < tmp.length; i++) {
        tmp[i].classList.remove("hidden");
    }
    document.querySelector(".new-game-button").classList.add("hidden");


    document.querySelector(".hit-button").addEventListener("click", hit);
    document.querySelector(".stand-button").addEventListener("click", checkWin);

    newGame();
}

function newGame(){
    player.addCard(deck.pop());
    dealer.addCard(deck.pop());
    player.addCard(deck.pop());
    dealer.addCard(deck.pop());

    if(player.score === 21){
        console.log("BJ");
        checkWin();
    }
    // viewMoney();
    
}

function viewMoney(){
    document.querySelector(".player-money").innerHTML    = player.money;
    document.querySelector(".dealer-money").innerHTML  = dealer.money;
    addColorMoney(".player-money", player.money);
    addColorMoney(".dealer-money", dealer.money);
}

function addColorMoney(className, money){
    let color = "text-success"; // Green
    if(money < 50){
        color = "text-danger"; // Red
    }else{
        if(money < 100){
            color = "text-warning"; // Orange
        }
    }
    const tmp = className.replace(".", "") + " " + color;
    document.querySelector(className).className = tmp;
}

function hit(){
    player.addCard(deck.pop());
    if(player.score >= 21){
        checkWin();
    }
}

// function stand(){
//     checkWin();
// }

function checkWin(){
    if (player.score === dealer.score){
        d++;
        console.log("draw")
    }
    else if (player.score > 21) {
        dealer.win = true;
        player.win = false;
        l++;
        player.money -= deal
        dealer.money += deal;
        console.log("Player Bust")
    }
    else if (dealer.score > 21) {
        dealer.win = false;
        player.win = true;
        w++;
        player.money += deal * 2
        dealer.money -= deal;
        console.log("Dealer BUST")
    }
    else if (player.score > dealer.score){
        dealer.win = false;
        player.win = true;
        w++;
        player.money += deal * 2
        dealer.money -= deal;
        console.log("Player WIN")
    }
    else if (player.score < dealer.score){
        dealer.win = true;
        player.win = false;
        l++;
        player.money -= deal
        dealer.money += deal;
        console.log("Dealer WIN")
    }
    viewMoney();

    reset();
}

function reset(){
    player.reset();
    dealer.reset();
    while(deck.length > 0)
        deck.pop();

    document.querySelector(".stat").innerHTML = `W: ${w} | D: ${d} | L: ${l}`;

    let tmp = document.querySelectorAll(".hidden");
    for (let i = 0; i < tmp.length; i++) {
        tmp[i].classList.remove("hidden");
    }
    document.querySelector(".hit-button").classList.add("hidden"); 
    document.querySelector(".stand-button").classList.add("hidden");    
    document.querySelector(".bj-table").classList.add("hidden");    

}

class Player{
    constructor(name, money){
        this.name = name;
        this.money = money
        this.hand = []
        this.score = 0
        this.win = null;
    }

    addCard(card){
        this.hand.push(card);
        const nameOfCard = card.replace(" ", "");
        card = card.split(" ")[0];
        switch (card) {
            case "J":
            case "Q":
            case "K":
                this.score += 10;
                break;
            case "A":
                this.score += 11;
                break;
            default:
                this.score += parseInt(card);
                break;
        }

        const cardHTML = document.createElement("img");
        cardHTML.src = `assets/cards/${nameOfCard}.gif`;
        cardHTML.alt = nameOfCard;
        console.log(`.${this.name}-cards`);
        document.querySelector(`.${this.name}-cards`).appendChild(cardHTML)
        console.log(this.score);
        document.querySelector(`.${this.name}-scores`).innerHTML = this.score


    }

    reset(){
        while(this.hand.length > 0)
            this.hand.pop();
        this.score = 0;
        this.win = null;
        while(document.querySelector(`.${this.name}-cards`).firstChild)
            document.querySelector(`.${this.name}-cards`).removeChild(document.querySelector(`.${this.name}-cards`).firstChild)
        document.querySelector(`.${this.name}-scores`).innerHTML = "";
    }
}

document.querySelector(".new-game-button").addEventListener("click", initGame);