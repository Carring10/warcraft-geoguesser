import { zones } from './zones.js';

const startScreen = document.querySelector('.start-screen');
const start = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const round = document.getElementById('round');
const lives = document.getElementById('lives');
const score = document.getElementById('score');
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');
const scoreScreen = document.querySelector('.score-screen');

let shuffledZones, currentZoneIndex, zone;
let userInput = [];

function hideGame() {
  gameContainer.style.display = 'none';
}

hideGame();

function hideScoreScreen() {
  scoreScreen.style.display = 'none';
}

hideScoreScreen();

start.addEventListener('click', startGame);

submit.addEventListener('click', function () {
  handleInput();
  // To prevent user from moving on without attempting
  userInput.forEach((character) => {
    if (character !== '') {
      next.style.display = 'block';
    }
  })
});

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

function getNextZone() {
  currentZoneIndex++
  zone = shuffledZones[currentZoneIndex];

  if (zone !== undefined) {
    showZone(zone);
  } else {
    showScoreScreen();
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
}

function reset() {
  next.style.display = 'none';
  userInput = [];

  while (inputFields.firstChild) {
    inputFields.removeChild(inputFields.firstChild);
  }
}

function showScoreScreen() {
  scoreScreen.style.display = 'block';
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

        scoreScreen.appendChild(userName);
        scoreScreen.appendChild(userScore);
      }
    });
}
