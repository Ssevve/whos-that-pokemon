const pokemonImage = document.querySelector('img');
const answerElement = document.querySelector('.answer');
const pElement = document.querySelector('p');
const guessInput = document.querySelector('#guess');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');


let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
updateScoreUi();
let pokemonName = '';
let userGuessed = false;


getRandomPokemonById();


document.addEventListener('keydown', (e) => {
  if (userGuessed && e.key === 'Enter') {
    getRandomPokemonById();
  }
});

document.querySelector('form').addEventListener('submit', checkGuess);

const buttons = [...document.querySelectorAll('button')];
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    const clickSound = new Audio('https://cdn.freesound.org/previews/536/536108_10912485-lq.mp3');
    clickSound.play();
    
    if (e.target.classList.contains('next-button')) {
      if (userGuessed) {
        // Allow skipping to the next Pokemon only if user has already tried to guess the current one
        getRandomPokemonById();
        updateScoreUi();

      }
    } else if (e.target.classList.contains('submit-button')) {
      checkGuess(e);
    }
  });
});


function checkGuess(e) {
  e.preventDefault();
  const userGuess = guessInput.value.trim().toLowerCase();
  if (userGuessed) return;
  if (userGuess === '') return;

  userGuessed = true;
  pokemonImage.classList.add('fade-in-animation');

  const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  answerElement.textContent = capitalizedPokemonName;
  pElement.classList.remove('hidden');

  if (userGuess === pokemonName) {
    score += 1;

    if (score > highScore) {
      localStorage.setItem('highScore', score);
      highScore = localStorage.getItem('highScore');
    }
    updateScoreUi();
  } else {
    score = 0;
  }
}

function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  fetch(url)
      .then(res => res.json())
      .then(data => {
        resetGameStateAndUi();
        updateScoreUi();
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.addEventListener('load', () => pokemonImage.classList.remove('fade-in-animation'));

        pokemonName = data.name;     
      })
      .catch(err => `error ${err}`);
}

function generateRandomId() {
  return Math.floor(Math.random() * 151 + 1); // only the 1st gen (151 pokemon)
}

function resetGameStateAndUi() {
  pokemonName = '';
  userGuessed = false;
  pElement.classList.add('hidden');
  guessInput.value = '';
}

function updateScoreUi() {
  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
}