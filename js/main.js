const elements = {
  pokemonImage: document.querySelector('img'),
  pElement: document.querySelector('p'),
  guessInput: document.querySelector('#guess'),
  buttons: document.querySelector('.buttons'),
}

const state = {
  score: 0,
  highScore: localStorage.getItem('highScore') || 0,
  pokemonName: '',
  userGuessed: false,
}

elements.buttons.addEventListener('click', (e) => {
  const clickSound = new Audio('https://cdn.freesound.org/previews/536/536108_10912485-lq.mp3');
  clickSound.play();

  if (e.target.classList.contains('submit-button')) {
    checkGuess(e);
  } else if (e.target.classList.contains('next-button') && state.userGuessed){
    // Allow skipping to the next Pokemon ONLY if the user has already tried to guess the current one
    getRandomPokemonById();
    updateScoreUi();
  }
});

document.addEventListener('keydown', (e) => {
  // Allow the user to skip to the next pokemon with the ENTER key if they have guessed already
  if (state.userGuessed && e.key === 'Enter') {
    getRandomPokemonById();
  }
});

document.querySelector('form').addEventListener('submit', checkGuess);

async function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;

  try {
    const res = await fetch(url);
    const data = await res.json();
      
    // Reset game state
    state.pokemonName = '';
    state.userGuessed = false;
    elements.guessInput.value = '';
    elements.guessInput.classList.remove('wrong');
    elements.guessInput.classList.remove('correct');
    elements.pElement.classList.add('hidden');

    updateScoreUi();
    
    elements.pokemonImage.src = data.sprites.front_default;
    elements.pokemonImage.addEventListener('load', () => elements.pokemonImage.classList.remove('fade-in-animation'));
    state.pokemonName = data.name;

  } catch (err) {
    console.log(`error: ${err}`);
  }    
}


function checkGuess(e) {
  e.preventDefault();
  const userGuess = elements.guessInput.value.trim().toLowerCase();
  if (state.userGuessed || userGuess === '') return;

  state.userGuessed = true;
  
  elements.pokemonImage.classList.add('fade-in-animation');

  const capitalizedPokemonName = state.pokemonName.charAt(0).toUpperCase() + state.pokemonName.slice(1);
  document.querySelector('.answer').textContent = capitalizedPokemonName;
  elements.pElement.classList.remove('hidden');

  if (userGuess === state.pokemonName) {
    elements.guessInput.classList.add('correct');
    state.score += 1;

    if (state.score > state.highScore) {
      localStorage.setItem('highScore', state.score);
      state.highScore = localStorage.getItem('highScore');
    }

    updateScoreUi();
  } else {
    elements.guessInput.classList.add('wrong');
    state.score = 0;
  }
}


function generateRandomId() {
  return Math.floor(Math.random() * 151 + 1); // only the 1st gen (151 pokemon)
}


function updateScoreUi() {
  document.querySelector('.score').textContent = state.score;
  document.querySelector('.high-score').textContent = state.highScore;
}


getRandomPokemonById();