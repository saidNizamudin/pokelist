export const setStatePokemon = (pokemon) => ({
  type: "SET_POKEMON",
  payload: pokemon,
});

export const deleteStatePokemon = (id) => ({
  type: "DELETE_POKEMON",
  payload: id,
});

export const renameStatePokemon = (pokemon) => ({
  type: "RENAME_POKEMON",
  payload: pokemon,
});

const initialState = {
  pokemonList: [],
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_POKEMON":
      return {
        ...state,
        pokemonList: action.payload,
      };

    case "DELETE_POKEMON":
      return {
        ...state,
        pokemonList: state.pokemonList.filter(
          (pokemon) => pokemon.id !== action.payload
        ),
      };

    case "RENAME_POKEMON":
      return {
        ...state,
        pokemonList: state.pokemonList.map((pokemon) =>
          pokemon.id === action.payload.id ? action.payload : pokemon
        ),
      };

    default:
      return state;
  }
};

export default pokemonReducer;
