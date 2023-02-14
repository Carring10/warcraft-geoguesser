import { zones } from './zones.js';

const startScreen = document.querySelector('.start-screen');
const start = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const zoneName = document.getElementById('zone-name');
const submit = document.getElementById('submit');
const next = document.getElementById('next');

const shuffleZones = [...zones].sort(() => 0.5 - Math.random());
let currentZone = shuffleZones[0];

function hideGame() {
  gameContainer.style.display = 'none';
}

hideGame();

start.addEventListener('click', startGame);

function startGame() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  getNextZone()
}

function getNextZone() {
  currentZone = shuffleZones[0];
  showZone(currentZone);
}

function showZone(zone) {
  zoneName.innerHTML = zone.name;

  const inputFields = document.getElementById('input-fields');

  for (let i = 0; i < zone.name.length; i++) {
    const input = document.createElement('input');

    inputFields.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('id', 'input');
  }
  // Auto focus the next input field
  for (let input of inputFields.children) {
    input.oninput = function () {
      if (input.nextElementSibling && input.value.length === 1) {
        input.nextElementSibling.focus();
      }
    }
    // When backspacing, focus the previous input field
    input.onkeydown = function (event) {
      const key = event.key;
      if (input.previousElementSibling && key === 'Backspace' || key === 'Delete') {
        input.previousElementSibling.focus();
      }
    }
  }
  submit.addEventListener('click', handleInput);
}

function handleInput() {
  const inputs = document.querySelectorAll('#input');
  let userInput = [];

  inputs.forEach((input) => {
    userInput.push(input.value);
  });
  // Check user's answer
  const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
  const answerKey = currentZone.name.toLowerCase();

  if (inputStr === answerKey) {
    console.log('correct');
  } else if (inputStr !== '') {
    console.log('incorrect')
  }
  console.log(userInput);

  next.style.display = 'display';
}
