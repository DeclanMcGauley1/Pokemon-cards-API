import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  const [search, setSearch] = useState(true);
  const [pokemon, setPokemon] = useState([]);
  const [sprites, setSprites] = useState([]);

  //Fetches the name and the api url for the first 10 pokemon
  useEffect(() => {
    if (search) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.results);
          setSearch(false);
          setUrl(data.next);
          let holder = [...pokemon, ...data.results];
          setPokemon(holder);
        })
        .catch((err) => console.log(err));
    }
  }, [url, search]);

  //fetches all the information about the pokemon and returns an array of their sprite addresses
  useEffect(() => {
    let resultsArray = [];
    pokemon.forEach((poke) => {
      let response = fetch(poke.url);
      resultsArray.push(response);
    });
    if (resultsArray.length > 0) {
      Promise.all(resultsArray)
        .then((data) => Promise.all(data.map((r) => r.json())))
        .then((res) => res.map((obj) => obj.sprites.front_default))
        .then((r) => setSprites(r))
        .catch((err) => console.log(err));
    }
  }, [pokemon]);

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  return (
    <>
      <header className="pageHeader">
        <h1 className="pageHeader-title">Pokemon</h1>
      </header>
      <main>
        <div className="pokeList-container">
          <ul className="pokeList">
            {pokemon.map((poke, index) => (
              <li className="pokeList-item">
                {poke.name} <img src={sprites[index]} alt={poke.name} />
              </li>
            ))}
            <li
              className="pokeList-item"
              onClick={async () => {
                setLoading(true);
                await delay(1000);
                setLoading(false);
                setSearch(!search);
              }}
            >
              {" "}
              {loading ? "Loading..." : "Load more Pokemon!"}
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}

export default App;
