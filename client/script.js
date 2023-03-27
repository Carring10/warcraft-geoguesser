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
// Start Game
const start = document.getElementById('start-button');
const lastSession = document.getElementById('last-session');
// Game info
const gameStats = document.querySelector('.game-info');
const gameContainer = document.querySelector('.game-container');
const round = document.getElementById('round');
const lives = document.getElementById('lives');
const score = document.getElementById('score');
const hintMessage = document.getElementById('hint-message');
const hint = document.getElementById('hint');
const hintButton = document.getElementById('hint-button');
const recordButton = document.getElementById('record-button');
// Zone info
const zoneImg = document.getElementById('zone-screenshot');
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');

let shuffledZones, currentZoneIndex, zone;
let userInput = [];

function hideElements() {
  gameContainer.style.display = 'none';
  gameStats.style.display = 'none';
  leaderBoard.style.display = 'none';
  players.style.display = 'none';
  gameOverScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'none';
  lastSession.style.display = 'none';
  recordScreen.style.display = 'none';
  endScreen.style.display = 'none';

  // If user's previous game didn't end in death, give the option to resume their last game
  if (localStorage.getItem('lives') > 0) {
    lastSession.style.display = 'flex';
  }
}

start.addEventListener('click', startGame);

revealLeaderBoard.addEventListener('click', showleaderBoard)

lastSession.addEventListener('click', getLastSession);

hintButton.addEventListener('click', revealHint);

submit.addEventListener('click', handleInput);

next.addEventListener('click', () => {
  round.innerHTML++;
  reset();
  getNextZone();
});

recordButton.addEventListener('click', recordScore);

function startGame() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  leaderBoard.style.display = 'flex';
  bgImg.style.display = 'flex';
  gameStats.style.display = 'flex';
  next.style.display = 'none';

  shuffledZones = [...zones].sort(() => 0.5 - Math.random());
  currentZoneIndex = 0
  zone = shuffledZones[currentZoneIndex];

  localStorage.setItem('shuffledZones', JSON.stringify(shuffledZones));

  showZone(zone);
}


function getLastSession() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  gameStats.style.display = 'flex';
  next.style.display = 'none';

  const getRound = localStorage.getItem('round');
  const getLives = localStorage.getItem('lives');
  const getHint = localStorage.getItem('hint');
  const getScore = localStorage.getItem('score');
  const getZones = JSON.parse(localStorage.getItem('shuffledZones'));

  round.innerHTML = getRound;
  lives.innerHTML = getLives;
  hint.innerHTML = getHint;
  score.innerHTML = getScore;

  currentZoneIndex = localStorage.getItem('index');
  shuffledZones = getZones;

  zone = getZones[currentZoneIndex];

  showZone(zone);
}

function revealHint() {
  hintButton.style.display = 'none';
  hint.innerHTML--;

  const hintText = document.createElement('p');

  hintText.innerText = zone.hint;
  hintMessage.appendChild(hintText);
}

function getNextZone() {
  currentZoneIndex++
  zone = shuffledZones[currentZoneIndex];

  if (zone !== undefined) {
    showZone(zone);
  } else {
    showleaderBoard();
  }
}

function showZone(zone) {
  zoneImg.setAttribute('src', zone.img);
  zoneName.innerText = zone.name;

  localStorage.setItem('index', currentZoneIndex);


  for (let i = 0; i < zone.name.length; i++) {
    const input = document.createElement('input');

    inputFields.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('id', 'input');
  }

  if (zone.name.includes(' ')) {
    const gap = document.createElement('div');
    const indexOfSpace = zone.name.indexOf(' ');
    const space = inputFields.children[indexOfSpace];

    if (space != undefined) {
      space.replaceWith(gap);
      gap.style.margin = '5px';
    }
  }

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
      if (input.previousElementSibling && key === 'Backspace' || key === 'Delete') {
        input.previousElementSibling.focus();
        inputFields.lastElementChild.value = '';

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

  inputs.forEach((input) => {
    userInput.push(input.value);
  });
  // Check user's answer
  const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
  const answerKey = zone.name.toLowerCase().replaceAll(' ', '');

  if (inputStr === answerKey) {
    inputs.forEach((input) => {
      input.style.border = '2px solid green'
      input.style.backgroundColor = '#005707a1'
    });

    let scoreValue = parseInt(score.innerHTML) + 10;

    score.innerHTML = scoreValue;
  } else if (inputStr !== '') {
    inputs.forEach((input) => {
      input.style.border = '2px solid red'
      input.style.backgroundColor = '#570000a1'
    });

    lives.innerHTML--;
  }
  // To prevent user from moving on without attempting
  userInput.forEach((character) => {
    if (character !== '') {
      next.style.display = 'flex';
      submit.replaceWith(next);
    }
  })

  if (lives.innerText === '0') {
    gameOver();
  }

  localStorage.setItem('round', round.innerHTML);
  localStorage.setItem('lives', lives.innerHTML);
  localStorage.setItem('hint', hint.innerHTML);
  localStorage.setItem('score', score.innerHTML);
}

function reset() {
  userInput = [];

  hintButton.style.display = 'flex';
  next.replaceWith(submit);

  if (hint.innerHTML === '0') {
    hintButton.style.display = 'none';
  }

  // Remove the previous input fields and hint message to prevent the new elements appending to the previous elements
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
  spiritHealerBgImg.style.display = 'flex'

  const stats = document.getElementById('stats');
  const statMessage = document.createElement('p');
  const playAgain = document.getElementById('play-button');
  const userRounds = localStorage.getItem('round');
  const userScore = localStorage.getItem('score');

  // Remove the previous game's stat message 
  if (stats.firstChild) {
    stats.removeChild(stats.firstChild);
  }

  stats.appendChild(statMessage);

  statMessage.innerHTML = "You successfully completed " + userRounds + " rounds with a score of " + userScore + ".";

  playAgain.addEventListener('click', restartGame);
}

function restartGame() {
  gameOverScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'none'
  round.innerHTML = '1';
  lives.innerHTML = '3';
  hint.innerHTML = '3';
  score.innerHTML = '0';

  reset();
  startGame();
}

function recordScore() {
  recordScreen.style.display = 'flex';
  gameOverScreen.style.display = 'none';
  spiritHealerBgImg.style.display = 'flex'

  const saveButton = document.getElementById('save-button');
  const cancel = document.getElementById('cancel');

  saveButton.addEventListener('click', submitScore);

  cancel.addEventListener('click', function () {
    recordScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    spiritHealerBgImg.style.display = 'flex';
  });
}

function submitScore() {
  const usernameInput = document.getElementById('username-input');
  const username = usernameInput.value.trim();
  const score = parseInt(localStorage.getItem('score'));

  fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, score }),
  })
    .then((response) => {
      if (response.ok) {
        recordScreen.style.display = 'none';
        spiritHealerBgImg.style.display = 'none';
        bgImg.style.display = 'flex';
        endScreen.style.display = 'flex';

        const successMessage = document.createElement('h2');
        const home = document.createElement('button');

        successMessage.setAttribute('class', 'success-message');
        home.setAttribute('class', 'home-button');

        endScreen.appendChild(successMessage);
        endScreen.appendChild(home);

        successMessage.innerText = "Success! Your score has been submitted to the leaderboard."
        home.innerHTML = "Return to homescreen"

        const refreshPage = () => {
          location.reload();
        }
        showleaderBoard();

        home.addEventListener('click', refreshPage);
      }
      return response.json();
    })
    .then((data) => {
      console.log('success!:', data);
    })
    .catch((error) => {
      console.log('error:', error);
    });
}

function showleaderBoard() {
  const players = document.getElementById('players');
  const player = document.getElementById('username');
  const playerScore = document.getElementById('user-score');

  leaderBoard.style.display = 'flex';
  revealLeaderBoard.innerHTML = '&#9660'

  if (players.style.display == 'none') {
    players.style.display = 'flex';
  } else {
    players.style.display = 'none'
    revealLeaderBoard.innerHTML = '&#9650'
  }

  fetch('http://localhost:3001/users')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Sort user's scores into descending order
      let users = [];

      for (let i = 0; i < data.users.length; i++) {
        const user = data.users[i].username;
        const score = data.users[i].score;

        users.push({ 'username': user, 'score': score });
      }

      users.sort((a, b) => b.score - a.score);

      users.forEach((user) => {
        const userName = document.createElement('p');
        const userScore = document.createElement('p');

        userName.textContent = user.username;
        userScore.textContent = user.score;

        player.appendChild(userName);
        playerScore.appendChild(userScore);
      });
    })
    .catch((error) => {
      console.log('error:', error);
    });
}

hideElements();
