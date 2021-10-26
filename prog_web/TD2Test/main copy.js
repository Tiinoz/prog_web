const val = ["2", "3", "4", "5", "6", "7", "8","9", "10", "J", "D", "K", "A"];
const suits = ["s", "h", "d", "c"];

let playerHand = [];
let dealerHand = [];
let deck = [];

let playerMoney = 0;
let bankMoney = 0;

let deal = 10;

let playerScore = 0;
let dealerScore = 0;

function initGame(){
    createDeck(deck);
    playerMoney = 1000;
    bankMoney = 1000;
}

function newGame(){
    initGame();
    initMoney();
    playerHand = [];
    dealerHand = [];
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    console.log(playerHand);
    console.log(dealerHand);
    let tmp = document.querySelectorAll(".hidden");
    for (let i = 0; i < tmp.length; i++) {
        tmp[i].classList.remove("hidden");
    }
    document.querySelector(".new-game-button").classList.add("hidden");
    playerScore = getScore(playerHand);
    dealerScore = getScore(dealerHand);
    console.log(playerScore)
    console.log(dealerScore)
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
    document.querySelector(className).className = color;
}

function initMoney(){
    document.querySelector(".player-money").innerHTML    = playerMoney;
    document.querySelector(".dealer-money").innerHTML  = bankMoney;
    addColorMoney(".player-money", playerMoney);
    addColorMoney(".dealer-money", bankMoney);
    // console.log(document.querySelector(".blind-value"));
    // document.querySelector(".blind-value").max = playerMoney;
}

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

// function getScore(hand){
//     let score = 0;
//     for(card of hand){
//         let tmp = card.split(" ")[0];
//         switch (tmp) {
//             case "J":
//             case "D":
//             case "K":
//                 score += 10;
//                 break;
//             case "A":
//                 score += 11;
//                 break;
//             default:
//                 score += parseInt(tmp);
//                 break;
//         }
//     }
//     return score;
// }

class Player{
    constructor(money){
        this.money = money
        this.hand = []
        this.score = 0
    }

    get score(){
        return this.score;
    }    

    get money(){
        return this.money;
    }

    get hand(){
        this.hand
    }

    calcScore(){
        for(card of this.hand){
            let tmp = card.split(" ")[0];
            switch (tmp) {
                case "J":
                case "D":
                case "K":
                    this.score += 10;
                    break;
                case "A":
                    this.score += 11;
                    break;
                default:
                    this.score += parseInt(tmp);
                    break;
            }
        }
        return score;
    }
}

document.querySelector(".new-game-button").addEventListener("click", newGame);