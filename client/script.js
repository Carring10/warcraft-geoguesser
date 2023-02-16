import { zones } from './zones.js';

const startScreen = document.querySelector('.start-screen');
const start = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const zoneName = document.getElementById('zone-name');
const inputFields = document.getElementById('input-fields');
const submit = document.getElementById('submit');
const next = document.getElementById('next');

let shuffledZones, currentZone
let userInput = [];

function hideGame() {
  gameContainer.style.display = 'none';
}

hideGame();

start.addEventListener('click', startGame);

next.addEventListener('click', () => {
  currentZone++
  reset();
  getNextZone();
});

function startGame() {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  next.style.display = 'none';

  shuffledZones = [...zones].sort(() => 0.5 - Math.random());
  currentZone = 0

  getNextZone();
}

function getNextZone() {
  let zone = shuffledZones[currentZone];
  showZone(zone);
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
  for (let input of inputFields.children) {
    input.oninput = function () {
      if (input.nextElementSibling && input.value.length === 1) {
        input.nextElementSibling.focus();
      }
    }
    // When backspacing, focus the previous input field
    input.onkeydown = function (event) {
      const key = event.key;
      if (input.nextElementSibling === null && key === 'Backspace' || key === 'Delete') {
        event.target.value = '';
      }
      if (input.previousElementSibling && key === 'Backspace' || key === 'Delete') {
        input.previousElementSibling.focus();
      } 
    }
  }
  submit.addEventListener('click', function () {
    handleInput(zone);

    next.style.display = 'block';
  });
}

function handleInput(zone) {
  const inputs = document.querySelectorAll('#input');

  inputs.forEach((input) => {
    userInput.push(input.value);
  });
  // Check user's answer
  const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
  const answerKey = zone.name.toLowerCase();

  if (inputStr === answerKey) {
    console.log('correct');
  } else if (inputStr !== '') {
    console.log('incorrect')
  }
  console.log(userInput);

  next.style.display = 'display';
}

function reset() {
  next.style.display = 'none';
  userInput = [];
  console.log('reset', userInput);

  while (inputFields.firstChild) {
    inputFields.removeChild(inputFields.firstChild);
  }
}
