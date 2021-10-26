function initDeck(){
    
}

function addColorMoney(id, money){
    var color = "text-success"; // Green
    if(money < 50){
        color = "text-danger"; // Red
    }else{
        if(money < 100){
            color = "text-warning"; // Orange
        }
    }
    document.getElementById(id).className = color;
}

function initMoney(){
    document.getElementById("myMoney").innerHTML    = playerMoney;
    document.getElementById("bankMoney").innerHTML  = bankMoney;
    addColorMoney("myMoney", playerMoney);
    addColorMoney("bankMoney", bankMoney);

}
function initGame(){
    initDeck();
    initMoney();
}


function bankTurn(){

}

function playerTurn(){

}

function addCard(name){

}

var playerMoney = 100; 
var bankMoney = 500;
var parie = 0;

var cardListPlayer = [];
var cardListBank = [];


var cardsValue      = [];
var cards           = [];


var valuePlayer = 0;
var valueBank = 0;

initGame();