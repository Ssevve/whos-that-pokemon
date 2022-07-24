const pokemonImage = document.querySelector('img');
const pElement = document.querySelector('p');
const guessInput = document.querySelector('#guess');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
updateScoreUi();
let pokemonName = '';
let userGuessed = false;

getRandomPokemonById();

document.addEventListener('keydown', (e) => {
  // Allow the user to skip to the next pokemon with enter key if they have guessed already
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
  if (userGuessed || userGuess === '') return;

  userGuessed = true;
  
  pokemonImage.classList.add('fade-in-animation');

  const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  document.querySelector('.answer').textContent = capitalizedPokemonName;
  pElement.classList.remove('hidden');

  if (userGuess === pokemonName) {
    guessInput.classList.add('correct');
    score += 1;

    if (score > highScore) {
      localStorage.setItem('highScore', score);
      highScore = localStorage.getItem('highScore');
    }

    updateScoreUi();
  } else {
    guessInput.classList.add('wrong');
    score = 0;
  }
}

async function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;

  try {
    const res = await fetch(url);
    const data = await res.json();
      
    // Reset game state
    pokemonName = '';
    userGuessed = false;
    guessInput.value = '';
    guessInput.classList.remove('wrong');
    guessInput.classList.remove('correct');
    pElement.classList.add('hidden');

    updateScoreUi();
    
    pokemonImage.src = data.sprites.front_default;
    pokemonImage.addEventListener('load', () => pokemonImage.classList.remove('fade-in-animation'));
    pokemonName = data.name;     

  } catch (err) {
    console.log(`error: ${err}`);
  }
        
}

function generateRandomId() {
  return Math.floor(Math.random() * 151 + 1); // only the 1st gen (151 pokemon)
}

function updateScoreUi() {
  document.querySelector('.score').textContent = score;
  document.querySelector('.high-score').textContent = highScore;
}