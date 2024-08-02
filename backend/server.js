const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "pokemon_list.json");

const readFromFile = () => {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
  } else {
    return [];
  }
};

const writeToFile = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.get("/api/catch", (req, res) => {
  const id = req.query.id;
  const savedPokemon = readFromFile();
  const isCaught = savedPokemon.some((pokemon) => {
    return pokemon.id == id;
  });

  if (isCaught || id == undefined) {
    res.json({
      success: false,
      message: "You have already caught this Pokémon!",
    });
  } else {
    const success = Math.random() < 0.5;
    res.json({
      success: success,
      message: success
        ? "You caught the Pokémon!"
        : "Failed to catch the Pokémon!",
    });
  }
});

app.post("/api/release", (req, res) => {
  const { id } = req.body;
  const savedPokemon = readFromFile();
  const number = Math.floor(Math.random() * 100);
  const isPrime = (num) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
      if (num % i === 0) return false;
    return num > 1;
  };

  if (isPrime(number)) {
    const updatedPokemon = savedPokemon.filter((pokemon) => {
      return pokemon.id != id;
    });
    writeToFile(updatedPokemon);
    res.json({
      success: true,
      message: `The Number is ${number} and the Pokémon has been released!`,
    });
  } else {
    res.json({
      success: false,
      message: `The Number is ${number} Failed to release the Pokémon!`,
    });
  }
});

app.post("/api/rename", (req, res) => {
  const { id } = req.body;
  const savedPokemon = readFromFile();

  const pokemon = savedPokemon.find((pokemon) => {
    return pokemon.id == id;
  });

  if (pokemon) {
    if (pokemon.firstCount == undefined) {
      pokemon.firstCount = 0;
    } else if (pokemon.firstCount == 0) {
      pokemon.secondCount = 0;
      pokemon.firstCount = 1;
    } else {
      const newCount = pokemon.firstCount + pokemon.secondCount;
      pokemon.secondCount = pokemon.firstCount;
      pokemon.firstCount = newCount;
    }
    writeToFile(savedPokemon);
    res.json({
      success: true,
      message: `Pokémon renamed to ${pokemon.nickname} - ${pokemon.firstCount}`,
      pokemon: pokemon,
    });
  } else {
    res.json({ success: false, message: "Pokémon not found!" });
  }
});

app.post("/api/save", (req, res) => {
  const { name, data } = req.body;
  const savedPokemon = readFromFile();
  savedPokemon.push({
    nickname: name,
    name: data.name,
    id: data.id,
    caughtAt: new Date(),
  });
  writeToFile(savedPokemon);
  res.json({ success: true, message: "Pokémon saved successfully!" });
});

app.get("/api/list", (req, res) => {
  const savedPokemon = readFromFile();
  res.json(savedPokemon);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
