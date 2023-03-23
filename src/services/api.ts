import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
  /* baseURL: "https://doit2-eric.herokuapp.com/", */
});
