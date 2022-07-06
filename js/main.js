let pokemonName = '';


getRandomPokemonById();


document.querySelector('form').addEventListener('submit', checkGuess);
// document.querySelector('.next-button').addEventListener('click', getRandomPokemonById);

const buttons = [...document.querySelectorAll('button')];
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    const clickSound = new Audio('https://cdn.freesound.org/previews/536/536108_10912485-lq.mp3');
    clickSound.play();
    
    if (e.target.classList.contains('next-button')) {
      getRandomPokemonById();
    } else if (e.target.classList.contains('submit-button')) {
      checkGuess(e);
    }
  });
});


function checkGuess(e) {
  e.preventDefault();
  console.log('submit');
}

function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  fetch(url)
      .then(res => res.json())
      .then(data => {  
        const image = document.querySelector('img');
        image.src = data.sprites.front_default;
        pokemonName = data.name;     
      })
      .catch(err => `error ${err}`);
}

function generateRandomId() {
  return Math.floor(Math.random() * 151 + 1); // only the 1st gen (151 pokemon)
}