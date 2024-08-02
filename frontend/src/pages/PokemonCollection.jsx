/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getPokemonCollection, releasePokemon, renamePokemon } from "../client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setStatePokemon,
  renameStatePokemon,
  deleteStatePokemon,
} from "../redux/reducers";

import styles from "./PokemonCollection.module.css";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = pokemon.id;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const handleRelease = (e) => {
    e.stopPropagation();
    releasePokemon({ id })
      .then((response) => {
        if (response.data.success) {
          dispatch(deleteStatePokemon(id));
          setTimeout(() => {
            alert(response.data.message);
          }, 300);
        } else {
          alert(response.data.message);
        }
      })
      .catch(() => {
        alert("Failed to release the Pokémon. Try again!");
      });
  };

  const handleRename = (e) => {
    e.stopPropagation();
    renamePokemon({ id })
      .then((response) => {
        dispatch(renameStatePokemon(response.data.pokemon));
        setTimeout(() => {
          alert(response.data.message);
        }, 300);
      })
      .catch(() => {
        alert("Failed to rename the Pokémon. Try again!");
      });
  };

  return (
    <div
      className={styles.pokemonCard}
      onClick={() => {
        navigate(`/${id}`);
      }}
    >
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleRelease}>
          RELEASE
        </button>
        <button className={styles.button} onClick={handleRename}>
          RENAME
        </button>
      </div>
      <img src={imageUrl} alt={pokemon.name} className={styles.pokemonImage} />
      <span className={styles.pokemonNickname}>
        {pokemon.nickname}{" "}
        {pokemon.firstCount != undefined && `- ${pokemon.firstCount}`}
      </span>
      <span className={styles.pokemonName}>
        {pokemon.name} #{id}
      </span>
    </div>
  );
};

const PokemonList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const pokemonList = useSelector((state) => state.pokemon).pokemonList;

  const fetchPokemon = async () => {
    if (isLoading) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const response = await getPokemonCollection();
      setTimeout(() => {
        dispatch(setStatePokemon(response.data));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <span className={styles.loaderText}>Loading Pokémon...</span>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
