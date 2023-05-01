import { zones } from './zones.js';

const bgImg = document.querySelector('.bg-img');
const spiritHealerBgImg = document.querySelector('.spirit-healer');
// Views
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over');
const recordScreen = document.querySelector('.record-score');
const endScreen = document.querySelector('.end-screen');
const leaderBoard = document.querySelector('.leaderboard');
const revealLeaderBoard = document.getElementById('reveal-leaderboard');
const saveButton = document.getElementById('save-button');
const cancel = document.getElementById('cancel');
// Start Game
const start = document.getElementById('start-button');
const lastSession = document.getElementById('last-session');
// Game info constants
const gameStats = document.querySelector('.game-info');
const gameContainer = document.querySelector('.game-container');
const round = document.getElementById('round');
const lives = document.getElementById('lives');
const score = document.getElementById('score');
const hintMessage = document.getElementById('hint-message');
const hint = document.getElementById('hint');
const hintButton = document.getElementById('hint-button');
const recordButton = document.getElementById('record-button');
// Zone constants
const zoneImg = document.getElementById('zone-screenshot');
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');
// Variables to be updated
let shuffledZones, currentZoneIndex, zone;
let userInput = [];

// If user's previous game didn't end in death, give the option to resume their last game
if (localStorage.getItem('lives') > 0) {
  lastSession.style.display = 'flex';
}


start.addEventListener('click', startGame);

revealLeaderBoard.addEventListener('click', showleaderBoard);

lastSession.addEventListener('click', getLastSession);

hintButton.addEventListener('click', revealHint);

submit.addEventListener('click', handleInput);

next.addEventListener('click', () => {
  round.innerHTML++;
  reset();
  getNextZone();
});

recordButton.addEventListener('click', showRecordScreen);

saveButton.addEventListener('click', recordScore);

cancel.addEventListener('click', function () {
  recordScreen.style.display = 'none';
  gameOverScreen.style.display = 'flex';
  spiritHealerBgImg.style.display = 'flex';
});

function startGame() {
  startScreen.style.display = 'none';
  zoneName.style.display = 'none';
  gameContainer.style.display = 'flex';
  leaderBoard.style.display = 'flex';
  bgImg.style.display = 'flex';
  gameStats.style.display = 'flex';
  next.style.display = 'none';

  // Shuffle zones and set the index to zero. The zone is set to the shuffled zone at the current index.
  shuffledZones = [...zones].sort(() => 0.5 - Math.random());
  currentZoneIndex = 0;
  zone = shuffledZones[currentZoneIndex];

  // Save the now shuffled array to local storage so a player can continue where they left off if need be.
  localStorage.setItem('shuffledZones', JSON.stringify(shuffledZones));

  showZone(zone);
}

function getNextZone() {
  // Iterate through the shuffled zones by increasing the index.
  currentZoneIndex++
  zone = shuffledZones[currentZoneIndex];

  // If a zone is undefined, that means the player has progressed through the entire array & there are no more zones left, so show the end game screen.
  if (zone !== undefined) {
    showZone(zone);
  } else {
    gameOver();
  }
}


function getLastSession() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  gameStats.style.display = 'flex';
  next.style.display = 'none';

  // Retrieve the players last game stats from local storage.
  const getRound = localStorage.getItem('round');
  const getLives = localStorage.getItem('lives');
  const getHint = localStorage.getItem('hint');
  const getScore = localStorage.getItem('score');
  const getZones = JSON.parse(localStorage.getItem('shuffledZones'));

  // Set the display to their previous stats.
  round.innerHTML = getRound;
  lives.innerHTML = getLives;
  hint.innerHTML = getHint;
  score.innerHTML = getScore;

  // If no more hints are left, remove the option to see the button.
  if (hint.innerHTML == 0) {
    hintButton.style.display = 'none';
  }

  // Set the current index to the last index the player was on.
  currentZoneIndex = localStorage.getItem('index');
  shuffledZones = getZones;

  zone = getZones[currentZoneIndex];

  showZone(zone);
}

function revealHint() {
  // Display the hint pertaining to the zone and subtract the amount of hints the player has left.
  hintButton.style.display = 'none';
  hint.innerHTML--;

  const hintText = document.createElement('p');

  hintText.innerText = zone.hint;
  hintMessage.appendChild(hintText);
}

function showZone(zone) {
  zoneImg.setAttribute('src', zone.img);

  // Remember the index so the player can revisit where they had left off.
  localStorage.setItem('index', currentZoneIndex);

// Create index boxes for each letter of the zone's name.
  for (let i = 0; i < zone.name.length; i++) {
    const input = document.createElement('input');

    inputFields.appendChild(input);

    input.setAttribute('autocomplete', 'off');
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('id', 'input');
  }

  // If there is a space in the zone's name, get the index of the space.
  if (zone.name.includes(' ')) {
    const gap = document.createElement('div');
    const indexOfSpace = zone.name.indexOf(' ');
    const space = inputFields.children[indexOfSpace];

    gap.setAttribute('id', 'space');

    // Replace the input box at the index of the space with a div, add margin so there is a gap between the strings and it appears to be an actual space.
    if (space != undefined) {
      space.replaceWith(gap);
      gap.style.margin = '5px';
    }

    // Make a line break on mobile screens
    const mediaQuery = window.matchMedia('(max-width: 700px)');

    if (mediaQuery.matches) {
      gap.style.width = '100%';
    }
  }

  // This zone is the only zone to have two spaces, so it needs two input boxes to be replaced.
  if (zone.name === 'Swamp of Sorrows') {
    const secondSpace = inputFields.children[8];
    const secondGap = document.createElement('div');

    if (secondSpace != undefined) {
      secondSpace.replaceWith(secondGap);
      secondGap.style.margin = '5px';
    }
  }

  // Auto focus the next input field
  inputFields.firstElementChild.focus();
  for (let input of inputFields.children) {
    input.oninput = function () {
      if (input.nextElementSibling && input.value.length === 1) {
        input.nextElementSibling.focus();
        // Skip over div to focus next input element
        if (input.nextElementSibling.nodeName == 'DIV') {
          input.nextElementSibling.nextElementSibling.focus();
        }
      }
    }
    // When backspacing, focus the previous input field
    input.onkeydown = function (event) {
      const key = event.key;
      if (input.previousElementSibling && inputFields.lastElementChild.value === '' && key === 'Backspace' || key === 'Delete') {
        input.previousElementSibling.focus();

        // Skip over div to focus previous input element
        if (input.previousElementSibling.nodeName == 'DIV') {
          input.previousElementSibling.previousElementSibling.focus();
        }
      }
    }
  }
}

function handleInput() {
  const inputs = document.querySelectorAll('#input');

  // Take the values of each input field and push them into the global array userInput.
  inputs.forEach((input) => {
    userInput.push(input.value);
  });

  // Check user's answer, remove commas and spaces so they are just consistent strings.
  const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
  const answerKey = zone.name.toLowerCase().replaceAll(' ', '');

  // Check the user's score & if they are correct, increase their score. If incorrect, decrease their lives. Add styling for visual confirmation.
  if (inputStr === answerKey) {
    inputs.forEach((input) => {
      input.style.border = '2px solid green';
      input.style.padding = '6px';
      input.style.backgroundColor = '#005707a1';

      zoneName.style.display = 'flex';
      zoneName.innerText = "Correct! This zone is " + zone.name;
    });

    let scoreValue = parseInt(score.innerHTML) + 10;

    score.innerHTML = scoreValue;
  } else if (inputStr !== '') {
    inputs.forEach((input) => {
      input.style.border = '2px solid red';
      input.style.padding = '6px';
      input.style.backgroundColor = '#570000a1';

      zoneName.style.display = 'flex';
      zoneName.innerText = "Better luck next time! It's " + zone.name;
    });

    lives.innerHTML--;
  }

  // To prevent user from moving on without attempting.
  userInput.forEach((character) => {
    if (character !== '') {
      next.style.display = 'flex';
      submit.replaceWith(next);
    }
  })

  // If their lives reach zero, end the game.
  if (lives.innerText === '0') {
    gameOver();
  }

  // Update the players stats in local storage after each round.
  localStorage.setItem('round', round.innerHTML);
  localStorage.setItem('lives', lives.innerHTML);
  localStorage.setItem('hint', hint.innerHTML);
  localStorage.setItem('score', score.innerHTML);
}

function reset() {
  // Clear their previous answer input.
  userInput = [];

  zoneName.style.display = 'none';

  hintButton.style.display = 'flex';
  next.replaceWith(submit);

  if (hint.innerHTML === '0') {
    hintButton.style.display = 'none';
  }

  // Remove the previous input fields and hint message to prevent the new elements appending to the previous elements.
  while (inputFields.firstChild) {
    inputFields.removeChild(inputFields.firstChild);
  }

  while (hintMessage.firstChild) {
    hintMessage.removeChild(hintMessage.firstChild);
  }
}

function gameOver() {
  gameContainer.style.display = 'none';
  gameStats.style.display = 'none';
  bgImg.style.display = 'none';
  leaderBoard.style.display = 'none';
  gameOverScreen.style.display = 'flex';
  spiritHealerBgImg.style.display = 'flex';

  const stats = document.getElementById('stats');
  const statMessage = document.createElement('p');
  const gameResult = document.getElementById('game-result');
  const playAgain = document.getElementById('play-button');
  const userRounds = localStorage.getItem('round');
  const userScore = localStorage.getItem('score');

  // Remove the previous game's stat message to replace with most recent game's stats.
  if (stats.firstChild) {
    stats.removeChild(stats.firstChild);
  }

  gameResult.innerHTML = "You ran out of lives..."

  stats.appendChild(statMessage);

  statMessage.innerHTML = "You successfully completed " + userRounds + " rounds with a score of " + userScore;

  // If the amount of rounds completed equals the length of the zones, that means the player has completed the game without running out of lives.
  if (Number(userRounds) === zones.length) {
    spiritHealerBgImg.style.display = 'none';
    bgImg.style.display = 'flex';

    gameResult.innerHTML = "Congrats! You won!"
  }

  playAgain.addEventListener('click', restartGame);
}

function restartGame() {
  // Reset all the values.
  gameOverScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'none'
  round.innerHTML = '1';
  lives.innerHTML = '3';
  hint.innerHTML = '3';
  score.innerHTML = '0';

  reset();
  startGame();
}

function showRecordScreen() {
  recordScreen.style.display = 'flex';
  gameOverScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'flex';

  document.getElementById('username-input').focus();
}

function recordScore() {
  // HTML elements
  const usernameEl = document.getElementById('username');
  const usernameInputEl = document.getElementById('username-input');
  const usernameCollection = usernameEl.children;
  
  // User's input
  const usernameInput = usernameInputEl.value.trim();
  let usernameArray = []

  // Loop through HTMLCollection and push the values into an array.
  Array.from(usernameCollection, (username) => {
    const usernameValues = username.innerHTML;
    usernameArray.push(usernameValues);
  });

  // If the player enters the username they play under, update that username's score, else create a new user.
  if (usernameArray.includes(usernameInput)) {
    updateScore();
  } else {
    submitScore();
  }
}

function showEndScreen() {
  recordScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'none';
  bgImg.style.display = 'flex';
  endScreen.style.display = 'flex';
  leaderBoard.style.display = 'flex';

  // Confirmation their username and score was uploaded to the leaderboard.
  const successMessage = document.createElement('h2');
  const home = document.createElement('button');

  successMessage.setAttribute('class', 'success-message');
  home.setAttribute('class', 'home-button');

  endScreen.appendChild(successMessage);
  endScreen.appendChild(home);

  successMessage.innerText = "Success! Your score has been submitted to the leaderboard.";
  home.innerHTML = "Return to homescreen";

  const refreshPage = () => {
    location.reload();
  }

  home.addEventListener('click', refreshPage);
}

function showleaderBoard() {
  const players = document.getElementById('players');

  revealLeaderBoard.innerHTML = '&#9660'

  if (players.style.display == 'none') {
    players.style.display = 'flex';

  } else {
    players.style.display = 'none'
    revealLeaderBoard.innerHTML = '&#9650'
  }
}

// Database queries
async function submitScore() {
  try {
    // Query the database with a new player and score.
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    const score = parseInt(localStorage.getItem('score'));

    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score }),
    });

    if (response.ok) {
      showEndScreen();
      updateLeaderBoard();
    }

    const data = await response.json();
    console.log('success!:', data);
  } catch (error) {
    console.log('error:', error);
  }
}

async function updateScore() {
  try {
    // Update a specific username's score.
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();
    const score = parseInt(localStorage.getItem('score'));

    const response = await fetch('http://localhost:3001/users/' + username, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score }),
    });

    if (response.ok) {
      showEndScreen();
      updateLeaderBoard();
    }

    const data = await response.json();
    console.log('success!:', data);
  } catch (error) {
    console.log('error:', error);
  }
}

async function getAllPlayerData() {
  try {
    // Query database.
    const response = await fetch('http://localhost:3001/users');
    const data = await response.json();
    console.log(response)
    console.log(data)
    console.log('success!:', data);
    // Pass all the data from the database to the sortAndAppendData function, which then does exactly that so a user can see the scores from highest to lowest.
    sortAndAppendData(data);
  } catch (error) {
    console.log('error:', error);
  }
}

function updateLeaderBoard() {
  const player = document.getElementById('username');
  const playerScore = document.getElementById('user-score');

  // Clear out HTML elements of usernames and scores to replace with the newest data.
  while (player.firstChild) {
    player.removeChild(player.firstChild);
  }

  while (playerScore.firstChild) {
    playerScore.removeChild(playerScore.firstChild);
  }

  getAllPlayerData();
}

function sortAndAppendData(data) {
  // Sort user's scores into descending order.
  let users = [];

  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i].username;
    const score = data.users[i].score;

    users.push({ 'username': user, 'score': score });
  }

  users.sort((a, b) => b.score - a.score);

  const player = document.getElementById('username');
  const playerScore = document.getElementById('user-score');

  const usernameH3 = document.createElement('h3');
  const scoreH3 = document.createElement('h3');

  usernameH3.textContent = "Username:"
  scoreH3.textContent = "Score:"

  player.appendChild(usernameH3);
  playerScore.appendChild(scoreH3);

  users.forEach((user) => {

    const userName = document.createElement('p');
    const userScore = document.createElement('p');

    userName.textContent = user.username;
    userScore.textContent = user.score;

    player.appendChild(userName);
    playerScore.appendChild(userScore);
  });
}

getAllPlayerData();
