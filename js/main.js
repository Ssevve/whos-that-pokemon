getRandomPokemonById();


function getRandomPokemonById() {
  const id = generateRandomId();
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  fetch(url)
      .then(res => res.json())
      .then(data => {  
        console.log(data);

        const image = document.querySelector('img');

        image.src = data.sprites.front_default;


      
      })
      .catch(err => `error ${err}`);
}


function generateRandomId() {
  return Math.floor(Math.random() * 151 + 1); // only the 1st gen (151 pokemon)
}