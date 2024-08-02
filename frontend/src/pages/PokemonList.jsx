/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getPokemonList } from "../client";
import { useNavigate } from "react-router-dom";

import styles from "./PokemonList.module.css";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  const id = pokemon.url.split("/")[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div
      className={styles.pokemonCard}
      onClick={() => {
        navigate(`/${id}`);
      }}
    >
      <img src={imageUrl} alt={pokemon.name} className={styles.pokemonImage} />
      <span className={styles.pokemonName}>{pokemon.name}</span>
    </div>
  );
};

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchedOffsets = useRef(new Set());
  const observerRef = useRef(null);
  const pokemonListRef = useRef([]);

  const fetchPokemon = async (offsetValue) => {
    if (fetchedOffsets.current.has(offsetValue) || isEndOfList || isLoading) {
      setIsLoading(false);
      return;
    }

    fetchedOffsets.current.add(offsetValue);
    setIsLoading(true);

    try {
      const response = await getPokemonList({ offset: offsetValue });
      if (response.data.next == null) {
        setIsEndOfList(true);
      }
      setTimeout(() => {
        setPokemonList((prevList) => [...prevList, ...response.data.results]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleIntersection = () => {
    if (pokemonListRef.current.length === 0) {
      return;
    }
    setOffset((prevOffset) => prevOffset + 20);
  };

  useEffect(() => {
    fetchPokemon(offset);
  }, [offset]);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleIntersection();
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    pokemonListRef.current = pokemonList;
  }, [pokemonList]);

  return (
    <>
      <div className={styles.contentContainer}>
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
        <div ref={observerRef} style={{ height: "1px" }} />
      </div>
      {isLoading && pokemonList.length === 0 ? (
        <div className={styles.loaderContainer}>
          <span className={styles.loaderText}>Loading more Pokémon...</span>
        </div>
      ) : isLoading ? (
        <div className={styles.loaderCard}>
          <span>Loading Pokémon...</span>
        </div>
      ) : null}
    </>
  );
};

export default PokemonList;
