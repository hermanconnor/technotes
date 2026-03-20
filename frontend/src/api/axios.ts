import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for sending/receiving cookies
});
