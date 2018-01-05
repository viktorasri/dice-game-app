const playerName = document.querySelectorAll('h3');
const score = document.querySelectorAll('h1');
const dice = document.querySelector('img');
const round = document.querySelector('.round');
const take = document.querySelector('p');
const getPlayerName = document.querySelectorAll('input[type=text]');
const getPlayerNameBtn = document.querySelector('#getting-started');
const getNumber = document.querySelector('input[type=number]');
const background = document.querySelector('.background');
const startForm = document.querySelector('.js-startForm');
const closeBtn = document.querySelector('.ion-ios-close');
const winForm = document.querySelector('.js-winForm');
const restartGame = document.querySelector('.js-restart');
const updateGame = document.querySelector('.js-update');
const showRoundHistory = document.querySelector('.round-history');
const bonusShow = document.querySelector('h5');
const winText = document.querySelector('.js-wintext')



var rand;
var roundData = 0;
var playerData = [0,0];
var active = Math.floor(Math.random()*2); //random player will start the game
var sound = new Audio('pop.mp3');
var winSound = new Audio('win.mp3');
var scoreToWin;
var diceHistory = [];
var bonus = 1;

var dice2 = false;
var dice3 = false;
var dice4 = false;
var dice5 = false;
var dice6 = false;

getPlayerNameBtn.addEventListener('click',function () {
    for (i=0; i<getPlayerName.length; i++){
        getPlayerName[i].value ==''? playerName[i].textContent = `Player ${i+1}`: playerName[i].textContent=getPlayerName[i].value;
    }
    scoreToWin = parseInt(getNumber.value);
    closeForms(startForm);
    playerName[active].classList.add('active');
    score[active].classList.add('active');
});

dice.addEventListener('click',function () {
    rand = Math.floor(Math.random()*5+2);
    diceH(rand);
    if (bonus<getBonus(rand)) {
        bonus=getBonus(rand);
        showBonus(bonus,'Duplicate Bonus');
    } else if (bonus<rowBonus(rand)) {
        bonus = rowBonus(rand);
        showBonus(bonus, 'Row Bonus');
    }
    sound.play();
    round.textContent = rand;
    dice.src= `img/${rand}.png`;

    if (rand==1) {          //Dice 1 burns all round score and switch to next player
        roundData=0;
        resetAllBonus();
        clearDiceH();
        switchPlayer();
    }else roundData += rand;
    round.textContent=roundData;
})

function resetAllBonus() {
    resetRowBonus();
    bonus=1;
    bonusShow.style.display= 'none';
}

take.addEventListener('click',function () {      //take round score
    if (roundData==0) return                        //prevent switching players then round score = 0
    else {
        roundData*=bonus;
        resetAllBonus();
        switchPlayer();
        clearDiceH();
    }
})

updateGame.addEventListener('click',function () {
    resetData();
    resetAllBonus();
    closeForms(winForm);
    openForms(startForm);
    playerName[active].classList.remove('active');
    score[active].classList.remove('active');
    active = Math.floor(Math.random()*2);

})

restartGame.addEventListener('click',function () {
    resetData();
    resetAllBonus();
    closeForms(winForm);
    playerName[active].classList.remove('active');
    score[active].classList.remove('active');
    active = Math.floor(Math.random()*2);
    playerName[active].classList.add('active');
    score[active].classList.add('active');
})

closeBtn.addEventListener('click',function () {
    closeForms(winForm);
});

//----------functions---------------
function rowBonus(n) {  //function lookup for 3 or 5 dice row (order not important) and return bonus multiplier
    switch(n){
        case 2:
            dice2 = true;
            break;
        case 3:
            dice3 = true;
            break;
        case 4:
            dice4 = true;
            break;
        case 5:
            dice5 = true;
            break;
        case 6:
            dice6 = true;
            break;
    }
    if (dice2 && dice3 && dice4 && dice5 && dice6 == true) return 4;
    if ((dice2*dice3*dice4 == true) || (dice3*dice4*dice5 == true) || (dice4*dice5*dice6 == true)) return 3;
    return 1
}

function getBonus(n) {              //function lookup through array for the same number amount and return bonus multiplier
    var same=0;
    for (i=0;i<diceHistory.length;i++){
        diceHistory[i]===n? same++ : null;
    }
    if (same>=5) {return 5;}
    if (same>=3) {return 4;}
    if (same==2) {return 2;}
    return 1;
}

function resetRowBonus() {                  //reset row bonus arguments
    dice2 = false;
    dice3 = false;
    dice4 = false;
    dice5 = false;
    dice6 = false;
}
function showBonus(n,text) {                //show bonus into user interface
    bonusShow.innerHTML = '<span>x'+n+'<span id="txt">'+text+'</span></span>';
    bonusShow.style.display= 'block';
}

function diceH(n) {                         //collect dice runs in array, show it in user interface
    diceHistory.push(n);
    var elm = document.createElement('IMG');
    showRoundHistory.appendChild(elm);
    elm.src = `img/${n}.png`;
};

function clearDiceH() {                     //remove dice array, remove img from user interface
    while (showRoundHistory.firstChild) {
        showRoundHistory.removeChild(showRoundHistory.firstChild);
        diceHistory.splice(0,1);
    }
};

function resetData() {                  //reset global score
    roundData = 0;
    for (i=0;i<score.length;i++){
        playerData[i] = 0;
        score[i].textContent = playerData[i];
    }
};


function closeForms(formName) {                 //close forms in user interface
    formName.style.display = 'none';
    background.style.display = 'none';
}

function openForms(formName) {              //display forms in user interface
    formName.style.display = 'block';
    background.style.display = 'block';
}

function switchPlayer() {                   //switch between players, check if score >= to win the game
    playerName[active].classList.remove('active');
    score[active].classList.remove('active');
    playerData[active]+=roundData;
    score[active].textContent = playerData[active];
    roundData = 0;
    round.textContent = roundData;
    if (playerData[active]>=scoreToWin){
        winText.textContent = `Congratulations ${playerName[active].textContent} wins the game`;
        openForms(winForm)
        winSound.play();
    }
    active++
    active==2? active=0:null;
    playerName[active].classList.add('active');
    score[active].classList.add('active');
}
