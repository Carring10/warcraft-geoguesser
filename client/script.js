import {zones} from './zones.js';

const startScreen = document.querySelector('.start-screen');
const beginQuiz = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const randomizeZones = [...zones].sort(() => 0.5 - Math.random());
const chosenZone = randomizeZones[0];
const zoneName = chosenZone.name;

function hideGame() {
  gameContainer.style.display = 'none';
}

hideGame();

beginQuiz.addEventListener('click', function (event) {
  event.preventDefault();
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
});

function displayZone() {
  randomizeZones.shift();
  const img = document.createElement('p');

  img.innerHTML = zoneName;
  gameContainer.appendChild(img);
}

function handleInput() {
  const inputFields = document.createElement('div');
  const submit = document.createElement('button');
  const userInput = [];

  gameContainer.appendChild(inputFields);
  gameContainer.appendChild(submit);

  inputFields.setAttribute('id', 'input-fields');
  submit.setAttribute('id', 'submit-button');

  submit.textContent = 'Submit';

  for (let i = 0; i < zoneName.length; i++) {
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
  // Submit letters from input
  submit.addEventListener('click', function () {
    const inputs = document.querySelectorAll('#input');
    inputs.forEach((input) => {
      userInput.push(input.value);
    });
    // Check user's answer
    const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
    const answerKey = zoneName.toLowerCase();

    if (inputStr === answerKey) {
      console.log('correct')
    } else {
      console.log('incorrect')
    }
  });
}

// fetch('http://localhost:3001/users')
//   .then(res => res.json())
//   .then(data => console.log(data))


displayZone();
handleInput();