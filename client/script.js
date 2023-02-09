const zones = [
  // Kalimdor
  {
    name: 'Teldrassil',
    img: 'placeholder',
    hint: "Home to the Night Elves."
  },
  {
    name: 'Darkshore',
    img: 'placeholder',
    hint: "It's long strip of coast on the northwestern part of Kalimdor."
  },
  {
    name: 'Moonglade',
    img: 'placeholder',
    hint: "Serves as a haven for druids, and is also the home of the Cenarion Circle."
  },
  {
    name: 'Winterspring',
    img: 'placeholder',
    hint: "The only settlement here is Everlook."
  },
  {
    name: 'Felwood',
    img: 'placeholder',
    hint: "It is a corrupted forest filled with tainted creatures of the woods, demonic satyr and infernals, and rotting treants and ancients."
  },
  {
    name: 'Felwood',
    img: 'placeholder',
    hint: "It is a corrupted forest filled with tainted creatures of the woods, demonic satyr and infernals, and rotting treants and ancients."
  },
  {
    name: 'Ashenvale',
    img: 'placeholder',
    hint: "This is one of the first contested zones new players on PvP servers will come across on kalimdor."
  },
  {
    name: 'Azshara',
    img: 'placeholder',
    hint: "This zone shares the name with the queen of the Naga."
  },
];

const startScreen = document.querySelector('.start-screen');
const beginQuiz = document.getElementById('start-button');
const gameContainer = document.querySelector('.game-container');
const randomizeZones = [...zones].sort(() => 0.5 - Math.random());
const chosenZone = randomizeZones[0];



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
  const zoneName = chosenZone.name;
  const img = document.createElement('p');
  const inputFields = document.createElement('div');

  img.innerHTML = zoneName;
  gameContainer.appendChild(img);
  gameContainer.appendChild(inputFields);

  inputFields.setAttribute('id', 'input-fields');

  for (let i = 0; i < zoneName.length; i++) {
    const input = document.createElement('input');

    inputFields.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('id', 'input');
  }

  for (let input of inputFields.children) {
    input.oninput = function () {
      if (input.nextElementSibling && input.value.length === 1) {
        console.log(input.value)
        input.nextElementSibling.focus();
      }
    }
    input.onkeydown = function (event) {
      const key = event.key;
      if (input.previousElementSibling && key === 'Backspace' || key === 'Delete') {
        input.previousElementSibling.focus();
      }
    }
  }
}

displayZone();