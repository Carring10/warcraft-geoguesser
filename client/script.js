import { zones } from './zones.js';

const bgImg = document.querySelector('.bg-img');
const startScreen = document.querySelector('.start-screen');
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
const gameOverScreen = document.querySelector('.game-over');
const recordButton = document.getElementById('record-button');
const recordScreen = document.querySelector('.record-score');
// Zone info
const zoneImg = document.getElementById('zone-screenshot');
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');
const leaderBoard = document.querySelector('.leaderboard');
const showLeaderBoard = document.getElementById('show-leaderboard');

let shuffledZones, currentZoneIndex, zone;
let userInput = [];

function hideElements() {
  gameContainer.style.display = 'none';
  gameStats.style.display = 'none';
  leaderBoard.style.display = 'none';
  gameOverScreen.style.display = 'none';
  lastSession.style.display = 'none';
  recordScreen.style.display = 'none';

  if (localStorage.getItem('lives') > 0) {
    lastSession.style.display = 'flex';
  }
}

start.addEventListener('click', startGame);

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

  if (getLives > 0) {
    console.log(getLives);
  }
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
  const inputBox = document.getElementById('input')

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
  next.style.display = 'none';
  hintButton.style.display = 'flex';

  if (hint.innerHTML === '0') {
    hintButton.style.display = 'none';
  }

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
  gameOverScreen.style.display = 'flex';

  const stats = document.getElementById('stats');
  const statMessage = document.createElement('p');
  const playAgain = document.getElementById('play-button');
  const userRounds = localStorage.getItem('round');
  const userScore = localStorage.getItem('score');

  stats.appendChild(statMessage);

  statMessage.innerHTML = "You successfully completed " + userRounds + " rounds with a score of " + userScore + ".";

  playAgain.addEventListener('click', restartGame);
}

function restartGame() {
  gameOverScreen.style.display = 'none';
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

  const saveButton = document.getElementById('save-button');
  const cancel = document.getElementById('cancel');

  saveButton.addEventListener('click', submitScore);

  cancel.addEventListener('click', function () {
    recordScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
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

        const successMessage = document.createElement('h2');
        leaderBoard.appendChild(successMessage);
        successMessage.innerText = "Success! Your score has been submitted to the leaderboard."

        showleaderBoard();
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
  leaderBoard.style.display = 'flex';
  gameContainer.style.display = 'none';
  gameStats.style.display = 'none';

  const homeScreen = document.getElementById('home-screen');

  homeScreen.addEventListener('click', function () {
    leaderBoard.style.display = 'none';
    startScreen.style.display = 'flex';
    bgImg.style.display = 'flex';

    round.innerHTML = '1';
    lives.innerHTML = '3';
    hint.innerHTML = '3';
    score.innerHTML = '0';

    reset();
  })

  fetch('http://localhost:3001/users')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // sort user's scores into descending order
      let users = [];

      for (let i = 0; i < data.users.length; i++) {
        const user = data.users[i].username;
        const score = data.users[i].score;

        users.push({ 'username': user, 'score': score });
      }

      users.sort((a, b) => b.score - a.score);

      users.forEach((user) => {
        const userName = document.createElement('h2');
        const userScore = document.createElement('p');

        userName.textContent = user.username;
        userScore.textContent = user.score;

        leaderBoard.appendChild(userName);
        leaderBoard.appendChild(userScore);
      });
    })
    .catch((error) => {
      console.log('error:', error);
    });
}

hideElements();
