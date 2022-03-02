document.getElementById("welcomePage").style.display ="block";
document.getElementById("preStartPage").style.display ="none";
document.getElementById("playingPage").style.display ="none";
document.getElementById("endingPage").style.display ="none";

//Refuse function keys as no need to use them in the game
window.document.onkeydown = function(evt){
    if ((evt.which == 37 && evt.altKey == true)
    || (evt.which == 39 && evt.altKey == true)
    || (evt.which == 8)
    || (evt.which == 9)
    || (evt.which == 37)
    || (evt.which == 38)
    || (evt.which == 39)
    || (evt.which == 40)
    || (evt.which == 121 && evt.shiftKey == true)
    || (evt.which == 13)
    || (evt.which == 32)
    || (evt.which == 46)
    ){ evt.which = null;
    return false;}
    document.oncontextmenu = function() {return false;}
}

// Global variables
//Game level that user can select
const gameLevel = {
    easy: 0,
    medium: 1,
    hard: 2
}

//Available timeLimit and corresponding limit time[s]
const timeLimit = {
    easy: 10,
    medium: 7,
    hard:5
}

const gameState = {
    idleState: 0,
    preStartCountDownState: 1,
    initState: 2,
    isPlayingState: 3,
    endingState: 4
}

//To change the level
let currentLevel = gameLevel.easy;
let currentTimeLimit = timeLimit.easy;
let currentState = gameState.idleState;
//Before start five few sec to prepare for user
let preStartCountdowntime = 4;
//Remaining time for the current round
let rem_time_round = 0;
//Remaining time of the current word
let rem_time_word = currentTimeLimit;
//Current given word
let currentWord = '';
// Array of current given word
let currentWordArr = '';
//Current word length to run some loop
let currWordLength = 0;
//Current word element to create a tag letter by letter
let currWordElem = '';
//Current word Element Id to put the color individually
let currWordElemId = '';
//Index to know which letter the user try to type now
let typeWordIndex = 0;
//Game score
let score = 0;
//High Score Record
let highScoreRecord = 0;
//Time ID in order to stop the timer when pre start countdown is done
let preStartCountdown_timer;
//Time ID in order to stop the timer when countdown is done
let countdown_timer;
//Time ID in order to stop the timer when game is over
let checkStatus_timer;
//String for store the current input value
let str = '';
// DOM
const preStartCountDown = document.querySelector('#preStartCountDown');
const wordInput = document.querySelector('#wordInput');
const currentWordDisp = document.querySelector('#current-word');
const ScoreDisplay = document.querySelector('#score');
const highScoreDisplay = document.querySelector('#highScore');
const timeRoundDisplay = document.querySelector('#rem_time_round');
const timeWordDisplay = document.querySelector('#rem_time_word');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const currentLevelDisp = document.querySelector('#currentLevel');
const totalScore = document.querySelector('#totalScore');
const highScoreMsg = document.querySelector('#highScoreMsg');

//const
//number of letters in the given word that is consider "easy" level
const wordLengthShort = 4;
//number of word letters in the given word that is consider "middle" level
const wordLengthMid = 8;
//Time limit for the entire round
const timeLimitRound = 30;

var soundSelect = new Audio('sound/select.mp3');
var soundStart = new Audio('sound/buttonStart.mp3');
var soundCountdown = new Audio('sound/countdown.mp3');
var soundCorrect = new Audio('sound/correct.mp3');
var soundMistype = new Audio('sound/mistype.mp3');
var soundCorrectType = new Audio('sound/correctType.mp3');


const words=[
    'hat',
    'river',
    'lucky',
    'statue',
    'generate',
    'stubborn',
    'cocktail',
    'runaway',
    'joke',
    'developer',
    'establishment',
    'here',
    'javascript',
    'nutrition',
    'revolver',
    'echo',
    'siblings',
    'definition'
];


//Level Button
function buttonClickEasy(){
    currentLevel = gameLevel.easy;
    currentTimeLimit = timeLimit.easy;
    seconds.innerHTML = currentTimeLimit;
    currentLevelDisp.innerHTML = "Easy";
    //If user click the button many times simultaneously, cancel the current sound and restart sound
    soundSelect.pause();
    soundSelect.currentTime = 0;
    soundSelect.play();

}
function buttonClickMedium(){
    currentLevel = gameLevel.medium;
    currentTimeLimit = timeLimit.medium;
    seconds.innerHTML = currentTimeLimit;
    currentLevelDisp.innerHTML = "Medium";
    //If user click the button many times simultaneously, cancel the current sound and restart sound
    soundSelect.pause();
    soundSelect.currentTime = 0;
    soundSelect.play();
}
function buttonClickHard(){
    currentLevel = gameLevel.hard;
    currentTimeLimit = timeLimit.hard;
    seconds.innerHTML = currentTimeLimit;
    currentLevelDisp.innerHTML = "Hard";
    //If user click the button many times simultaneously, cancel the current sound and restart sound
    soundSelect.pause();
    soundSelect.currentTime = 0;
    soundSelect.play();
}

//Show the level and limit time
function showLevel(){
    seconds.innerHTML = currentTimeLimit;

}

//Game Start Button
function buttonClickStart(){
    currentState = gameState.preStartCountDownState;
    welcomePage.style.display ="none";
    preStartPage.style.display ="block";
    playingPage.style.display ="none";
    endingPage.style.display ="none";
    //setInterval - call the input func every input time[ms]
    preStartCountdown_timer = setInterval(preStartCountdown, 1000);
    
    soundStart.play();
}

//preStartCountdown
function preStartCountdown(){
    preStartCountdowntime--;
    if(preStartCountdowntime <= 0){
        init();
        clearInterval(preStartCountdown_timer);
        preStartCountdowntime = 4;
        preStartCountDown.innerHTML = '';
    }
    else{
        //Show the countdown on screen
        preStartCountDown.innerHTML = preStartCountdowntime;
        //Countdown sound
        soundCountdown.play();
    }
}


// Init Game
function init(){
    currentState = gameState.initState;
    welcomePage.style.display ="none";
    preStartPage.style.display ="none";
    playingPage.style.display ="block";
    endingPage.style.display ="none";

    //Clear the value in the input box
    wordInput.value = '';
    //Clear the HTML child tag of current word. The tags are used for coloring
    currentWordDisp.innerHTML = '';
    //Init the current typing word index
    typeWordIndex = 0;

    //Stop Timer
    clearInterval(countdown_timer);
    clearInterval(checkStatus_timer);

    //Clear round timer
    rem_time_round = timeLimitRound;
    timeRoundDisplay.innerHTML = rem_time_round;

    //Clear message
    message.innerHTML = '';
    //Clear Score
    ScoreDisplay.innerHTML = 0;

    //Show the current mode time limit in UI instruction
    seconds.innerHTML = currentTimeLimit;
    //Set the remaining time to default plus 1, considering the loading time 
    rem_time_word = currentTimeLimit + 1;

    // Load & Display word from array
    showWord(words);

    main();
}

function main(){
    currentState = gameState.isPlayingState;

    //setInterval - call the input func every input time[ms]
    countdown_timer = setInterval(countdown, 1000);

    //Auto Focus to the input text box
    document.getElementById('wordInput').focus();

    //Start matching on word input
    // wordInput.addEventListener('input', checkInput);//test

    //Check game status
    checkStatus_timer = setInterval(checkStatus, 50);
}

// Check if the input word is match to the current word
function checkInput($this)
{
    str=$this.value;
    message.innerHTML = '';
    console.log(wordInput.value[typeWordIndex]);
    if(currentWordArr[typeWordIndex] === wordInput.value[typeWordIndex]){
        //type correct letter
        let CurrWordId = document.getElementById("currWordElemId_" + typeWordIndex);
        CurrWordId.style.color = "orange";

        soundCorrectType.pause();
        soundCorrectType.currentTime = 0;
        soundCorrectType.play();
        typeWordIndex++;

        //Correct entire word
        if(typeWordIndex == currWordLength){
            //Word type complete, go to the next word
            typeWordIndex = 0;
            str='';
            message.innerHTML = 'Correct!'
            soundCorrect.pause();
            soundCorrect.currentTime = 0;
            soundCorrect.play();
            //Clear the HTML child tag of current word. The tags are used for coloring
            currentWordDisp.innerHTML = '';
            //increment round time as clear bonus
            rem_time_round++;
            timeRoundDisplay.innerHTML = rem_time_round;
            calcScore();
            switchWord();
        }
    }
    else{
        //mistype
        //if mistype, remove the typed word so that user doesn't have to delete by himself
        str=str.slice( 0, -1 );
        soundMistype.pause();
        soundMistype.currentTime = 0;
        soundMistype.play();
    }
    $this.value=str;

}

//Calc score based on the number of letters in the given word AND selected game level
function calcScore(){
    if(currentLevel == gameLevel.easy){
        if (currentWord.length <= wordLengthShort){
            //EasyLevel * short word
            score = score + 1;
            console.log("easy easy");
        }
        else if(currentWord.length <= wordLengthMid){
            //Easy Level * Middle word
            score = score + 3;
            console.log("easy mid");
        }
        else{
            //Easy Level * long word
            score = score + 5;
            console.log("easy hard");
        }
    }
    else if(currentLevel == gameLevel.medium){
        if (currentWord.length <= wordLengthShort){
            //Medium Level * short word
            score = score + 2;
            console.log("mid easy");
        }
        else if(currentWord.length <= wordLengthMid){
            //Medium Level * middle word
            score = score + 4;
            console.log("mid mid");
        }
        else{
            //Medium Level * long word
            score = score + 6;
            console.log("mid hard");
        }
    }
    else{
        //currentLevel == gameLevel.hard
        if (currentWord.length <= wordLengthShort){
            //Hard Level * short word
            score = score + 4;
            console.log("hard easy");
        }
        else if(currentWord.length <= wordLengthMid){
            //Hard Level * Middle word
            score = score + 6;
            console.log("hard mid");
        }
        else{
            //Hard Level * long word
            score = score + 8;
            console.log("hard hard");
        }
    }
}

//Clean the input box and switch to the next word
function switchWord(){
        rem_time_word = currentTimeLimit + 1;
        showWord(words);
        wordInput.value = '';
        //If the score is negative, display 0
        if(score < 0){
            ScoreDisplay.innerHTML = 0;
        }
        else{
            ScoreDisplay.innerHTML = score;
        }
}

//Pick & show the random word
function showWord(words){
    //Generak random index - 
    // Math.floor: Cut off the dicimal number
    // Math.random: Generate number x (0 <= x < 1)
    const randomIndex = Math.floor(Math.random() *words.length);
    //Store the current word for calc score
    currentWord = words[randomIndex];
    //Store the current word as an array to check the letter one by one later
    currentWordArr = currentWord.split('');
    //get the Given word length
    currWordLength = currentWordArr.length;
    //Create element for each letters & displaying the entire given word on screen
    createTagAndDispScreen();
}

//create currentWord id letter by letter to change the color
function createTagAndDispScreen(){
    //Create span tag for each letter
    for (let countWord = 0; countWord < currWordLength; countWord++){
        //Create the span tag for each letter of given word
        currWordElem = document.createElement("span");
        //Add Tag for each span tag in order to put color when the type is correct for the letter of given word
        currWordElem.id = "currWordElemId_" + countWord;
        //Insert the letter of given word into the created span tag
        currWordElem.textContent = currentWordArr[countWord];
        //Insert current span tag(1 letter inside) into the CurrentWord HTML parent Tag so that entire word can be shown on screen
        currentWordDisp.appendChild(currWordElem);
    }
}

//Countdown timer - 1000ms cycle
function countdown(){
    //Make sure the time is not run out
    if(rem_time_word > 0 && rem_time_round > 0){
        //Decrement timer
        rem_time_word--;
        rem_time_round --;
    }
    else{
        //Game over
        currentState = gameState.idleState;

        //Stop Timer when game over
        clearInterval(countdown_timer);
    }
    //Show the remaining time
    timeWordDisplay.innerHTML = rem_time_word;
    timeRoundDisplay.innerHTML = rem_time_round;
}

//Check game status - 50ms cycletime
function checkStatus(){
    //=== : strict equal check, with the data type
    if((currentState === gameState.isPlayingState) && 
    ((rem_time_word === 0) || (rem_time_round === 0))){
        currentState = gameState.endingState;   
        welcomePage.style.display ="none";
        preStartPage.style.display ="none";
        playingPage.style.display ="none";
        endingPage.style.display ="block";
        message.innerHTML = 'Game Over!!';
        
        totalScore.innerHTML = score;

        // High Score
        if(score > highScoreRecord){
            highScoreRecord = score;
            highScoreDisplay.style.color = "yellow";
            highScoreMsg.innerHTML = "New Record!"
        }
        else{
            highScoreMsg.innerHTML = ""
            highScoreDisplay.style.color = "white";
        }
        highScoreDisplay.innerHTML = highScoreRecord;
        score = 0;
        clearInterval(checkStatus_timer);
        currentWordDisp.innerHTML = '';
    }
    else{
        //Game is not started OR on going
    }
}

function buttonClickgoBackHome(){
    welcomePage.style.display ="block";
    preStartPage.style.display ="none";
    playingPage.style.display ="none";
    endingPage.style.display ="none";
}