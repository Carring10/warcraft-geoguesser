import { zones } from './zones.js';

// fetch('http://localhost:3001/users')
//   .then(res => res.json())
//   .then(data => console.log(data))

const startScreen = document.querySelector('.start-screen');
const beginQuiz = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const zoneContainer = document.createElement('div');
const randomizeZones = [...zones].sort(() => 0.5 - Math.random());
let currentZone = randomizeZones[0];

function hideGame() {
  gameContainer.style.display = 'none';
}

hideGame();

beginQuiz.addEventListener('click', function (event) {
  event.preventDefault();

  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
});

function displayZone(zone) {
  randomizeZones.shift();
  const img = document.createElement('p');

  img.innerHTML = zone.name;
  gameContainer.appendChild(zoneContainer);
  zoneContainer.appendChild(img);
}

displayZone(currentZone);

function handleInput(zone) {
  const inputFields = document.createElement('div');
  const submit = document.createElement('button');
  let userInput = [];

  zoneContainer.appendChild(inputFields);
  zoneContainer.appendChild(submit);

  inputFields.setAttribute('id', 'input-fields');
  submit.setAttribute('id', 'submit-button');

  submit.textContent = 'Submit';

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
  // Submit letters from input
  submit.addEventListener('click', function () {
    const inputs = document.querySelectorAll('#input');
    userInput = [];

    inputs.forEach((input) => {
      userInput.push(input.value);
    });
    // Check user's answer
    const inputStr = userInput.toString().replaceAll(',', '').toLowerCase();
    const answerKey = zone.name.toLowerCase();

    if (inputStr === answerKey) {
      console.log('correct');
      createNextBtn();
    } else if (inputStr !== '') {
      console.log('incorrect')
      createNextBtn();
    }
    console.log(userInput)
    // Next zone
    function createNextBtn() {
      const nextBtn = document.createElement('button');
      zoneContainer.appendChild(nextBtn);
      nextBtn.textContent = 'Next';

      nextBtn.addEventListener('click', function () {
        if (inputStr !== '') {
          getNextZone();
        }
      });
    }
  });
}

function getNextZone() {
  currentZone = randomizeZones[0];

  displayZone(currentZone);
  handleInput(currentZone);
}

handleInput(currentZone);