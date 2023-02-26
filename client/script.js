import { zones } from './zones.js';

const startScreen = document.querySelector('.start-screen');
const start = document.getElementById('start-button');
// Game info
const gameContainer = document.querySelector('.game-container');
const round = document.getElementById('round');
const lives = document.getElementById('lives');
const score = document.getElementById('score');
const hintContainer = document.getElementById('hint-container');
const hint = document.getElementById('hint');
const hintButton = document.getElementById('hint-button');
const gameOverScreen = document.querySelector('.game-over');
// Zone info
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');
const leaderBoard = document.querySelector('.leaderboard');

let shuffledZones, currentZoneIndex, zone;
let userInput = [];

function hideScreens() {
  gameContainer.style.display = 'none';
  leaderBoard.style.display = 'none';
  gameOverScreen.style.display = 'none';
}

start.addEventListener('click', startGame);

hintButton.addEventListener('click', revealHint);

submit.addEventListener('click', handleInput);

next.addEventListener('click', () => {
  round.innerHTML++;
  reset();
  getNextZone();
});

function startGame() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  next.style.display = 'none';

  shuffledZones = [...zones].sort(() => 0.5 - Math.random());
  currentZoneIndex = 0
  zone = shuffledZones[currentZoneIndex];

  showZone(zone);
}

function revealHint() {
  hintButton.style.display = 'none';
  hint.innerHTML--;

  const hintText = document.createElement('p');

  hintText.innerText = zone.hint;
  hintContainer.appendChild(hintText);
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
  zoneName.innerText = zone.name;

  for (let i = 0; i < zone.name.length; i++) {
    const input = document.createElement('input');

    inputFields.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('id', 'input');
  }
  // Auto focus the next input field
  inputFields.firstElementChild.focus();
  for (let input of inputFields.children) {
    input.oninput = function () {
      if (input.firstElementChild) {
      }
      if (input.nextElementSibling && input.value.length === 1) {
        input.nextElementSibling.focus();
      }
    }
    // When backspacing, focus the previous input field
    input.onkeydown = function (event) {
      const key = event.key;
      if (input.previousElementSibling && key === 'Backspace' || key === 'Delete') {
        event.target.value = '';
        input.previousElementSibling.focus();
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
  const answerKey = zone.name.toLowerCase();

  if (inputStr === answerKey) {
    console.log('correct');
    let scoreValue = parseInt(score.innerHTML) + 10;

    score.innerHTML = scoreValue;
  } else if (inputStr !== '') {
    console.log('incorrect');
    lives.innerHTML--;
  }
  // To prevent user from moving on without attempting
  userInput.forEach((character) => {
    if (character !== '') {
      next.style.display = 'block';
    }
  })

  if (lives.innerText === '0') {
    gameOver();
  }

  localStorage.setItem('score', score.innerHTML);

}

function reset() {
  userInput = [];
  next.style.display = 'none';
  hintButton.style.display = 'block';

  if (hint.innerHTML === '0') {
    hintButton.style.display = 'none';
  }

  while (inputFields.firstChild) {
    inputFields.removeChild(inputFields.firstChild);
  }

  while (hintContainer.firstChild) {
    hintContainer.removeChild(hintContainer.firstChild);
  }
}

function gameOver() {
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';

  const playAgain = document.getElementById('play-button');

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

function showleaderBoard() {
  leaderBoard.style.display = 'block';
  gameContainer.style.display = 'none';

  fetch('http://localhost:3001/users')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.users.length; i++) {
        const userName = document.createElement('h2');
        const userScore = document.createElement('p');

        userName.textContent = data.users[i].username;
        userScore.textContent = data.users[i].score;

        leaderBoard.appendChild(userName);
        leaderBoard.appendChild(userScore);
      }
    });
}

hideScreens();
