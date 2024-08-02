import AxiosInstances from "axios";

const axios = AxiosInstances.create();
const axiosLocal = AxiosInstances.create({
  baseURL: "http://localhost:5000",
});

export function getPokemonList(params) {
  return axios.request({
    url: `https://pokeapi.co/api/v2/pokemon`,
    method: "get",
    params: params,
  });
}

export function getPokemonDetail(id) {
  return axios.request({
    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
    method: "get",
  });
}

export function getPokemonSpecies(id) {
  return axios.request({
    url: `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    method: "get",
  });
}

export function catchPokemon(params) {
  return axiosLocal.request({
    url: "/api/catch",
    method: "get",
    params,
  });
}

export function releasePokemon(data) {
  return axiosLocal.request({
    url: `/api/release`,
    method: "post",
    data,
  });
}

export function renamePokemon(data) {
  return axiosLocal.request({
    url: `/api/rename`,
    method: "post",
    data,
  });
}

export function savePokemon(data) {
  return axiosLocal.request({
    url: "/api/save",
    method: "post",
    data,
  });
}

export function getPokemonCollection() {
  return axiosLocal.request({
    url: "/api/list",
    method: "get",
  });
}
