import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  catchPokemon,
  savePokemon,
  getPokemonDetail,
  getPokemonSpecies,
} from "../client";
import { useNavigate } from "react-router-dom";

import styles from "./PokemonDetail.module.css";

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAbout, setIsLoadingAbout] = useState(true);
  const [isInCollection, setIsInCollection] = useState(false);
  const [page, setPage] = useState(0);

  const typeColors = {
    normal: {
      backgroundColor: "#A8A77A",
      textColor: "#FFFFFF",
    },
    fire: {
      backgroundColor: "#EE8130",
      textColor: "#FFFFFF",
    },
    water: {
      backgroundColor: "#6390F0",
      textColor: "#FFFFFF",
    },
    electric: {
      backgroundColor: "#F7D02C",
      textColor: "#000000",
    },
    grass: {
      backgroundColor: "#7AC74C",
      textColor: "#000000",
    },
    ice: {
      backgroundColor: "#96D9D6",
      textColor: "#000000",
    },
    fighting: {
      backgroundColor: "#C22E28",
      textColor: "#FFFFFF",
    },
    poison: {
      backgroundColor: "#A33EA1",
      textColor: "#FFFFFF",
    },
    ground: {
      backgroundColor: "#E2BF65",
      textColor: "#000000",
    },
    flying: {
      backgroundColor: "#A98FF3",
      textColor: "#000000",
    },
    psychic: {
      backgroundColor: "#F95587",
      textColor: "#FFFFFF",
    },
    bug: {
      backgroundColor: "#A6B91A",
      textColor: "#000000",
    },
    rock: {
      backgroundColor: "#B6A136",
      textColor: "#FFFFFF",
    },
    ghost: {
      backgroundColor: "#735797",
      textColor: "#FFFFFF",
    },
    dragon: {
      backgroundColor: "#6F35FC",
      textColor: "#FFFFFF",
    },
    dark: {
      backgroundColor: "#705746",
      textColor: "#FFFFFF",
    },
    steel: {
      backgroundColor: "#B7B7CE",
      textColor: "#000000",
    },
    fairy: {
      backgroundColor: "#D685AD",
      textColor: "#000000",
    },
  };

  const navigate = useNavigate();

  function handleCatchPokemon() {
    catchPokemon({
      id: id,
    }).then((response) => {
      if (response.data.success) {
        let nickname = "";

        while (!nickname) {
          nickname = prompt("You caught the Pokemon! Give it a nickname:");

          if (!nickname) {
            alert(
              "Not everyday you get to catch a Pokemon. Give it a nickname!"
            );
          }
        }

        savePokemon({
          name: nickname,
          data: {
            name: pokemon.name,
            id: pokemon.id,
          },
        })
          .then((response) => {
            alert(`You have successfully saved ${nickname}!`);
          })
          .catch((error) => {
            alert("Failed to save the Pokemon. Try again!");
            return;
          });
      } else {
        alert(response.data.message);
      }
    });
  }

  useEffect(() => {
    setIsLoading(true);
    getPokemonDetail(id)
      .then((response) => {
        setPokemon(response.data);

        getPokemonSpecies(id)
          .then((response) => {
            setPokemon((prevPokemon) => {
              return {
                ...prevPokemon,
                flavor_text_entries: response.data.flavor_text_entries,
              };
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <span className={styles.loaderText}>Please Wait...</span>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.pokemonTitle}>
        {pokemon?.name} - #{pokemon?.id}
        <button className={styles.catchButton} onClick={handleCatchPokemon}>
          CATCH
        </button>
      </div>
      <div className={styles.pokemonDetail}>
        <div className={styles.pokemonImageContainer}>
          <img
            alt={pokemon?.name}
            src={pokemon?.sprites?.other?.["official-artwork"]?.front_default}
            className={styles.pokemonImage}
          />
        </div>
        <div className={styles.pokemonContent}>
          <div className={styles.pokemonDesc}>
            <div className={styles.pokemonTypes}>
              {pokemon?.types?.map((type) => {
                return (
                  <span
                    key={type.type.name}
                    className={styles.pokemonType}
                    style={{
                      backgroundColor:
                        typeColors[type.type.name].backgroundColor,
                      color: typeColors[type.type.name].textColor,
                    }}
                  >
                    {type.type.name}
                  </span>
                );
              })}
            </div>
            <div className={styles.pokemonDescription}>
              {pokemon?.flavor_text_entries?.[0]?.flavor_text}
            </div>
            <div className={styles.pokemonBasic}>
              <span className={styles.textTitle}>Basic</span>
              <span className={styles.text}>Weight: {pokemon?.weight}</span>
              <span className={styles.text}>Height: {pokemon?.height}</span>
            </div>
            <div className={styles.pokemonAbilities}>
              <span className={styles.textTitle}>Abilities</span>
              {pokemon?.abilities?.map((ability) => {
                return (
                  <li key={ability.ability.name} className={styles.text}>
                    {ability.ability.name}
                  </li>
                );
              })}
            </div>
          </div>
          <div className={styles.pokemonMoves}>
            <div className={styles.movesTitle}>
              <span className={styles.textTitle}>Moves</span>
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() => {
                    setPage(page - 1);
                  }}
                  disabled={page === 0}
                >
                  <span>Prev</span>
                </button>
                <button
                  className={styles.paginationButton}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  disabled={(page + 1) * 5 > pokemon.moves.length}
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {pokemon?.moves
                  ?.slice(
                    page * 5,
                    page * 5 + 5 > pokemon.moves.length
                      ? pokemon.moves.length
                      : page * 5 + 5
                  )
                  ?.map((move) => {
                    return (
                      <tr key={move.move.name}>
                        <td>{move.move.name}</td>
                        <td>
                          {move.version_group_details[0].level_learned_at}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
