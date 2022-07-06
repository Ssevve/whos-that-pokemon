let pokemonName = '';
let userGuessed = false;
const pokemonImage = document.querySelector('img');
const answerElement = document.querySelector('.answer');
const pElement = document.querySelector('p');
const guessInput = document.querySelector('#guess');

getRandomPokemonById();


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
        userGuessed = false;
      }
    } else if (e.target.classList.contains('submit-button')) {
      checkGuess(e);
    }
  });
});

function checkGuess(e) {
  e.preventDefault();
  const userGuess = guessInput.value.trim().toLowerCase();
  if (userGuess === '') return;

  userGuessed = true;
  pokemonImage.classList.add('fade-in-animation');

  const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  answerElement.textContent = capitalizedPokemonName;
  pElement.classList.remove('hidden');
}

function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  fetch(url)
      .then(res => res.json())
      .then(data => {
        resetGameStateAndUi();

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