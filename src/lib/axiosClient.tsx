import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  // baseURL: "https://beabsenfscm.vercel.app/",
  baseURL: "http://localhost:3040",
  headers: { "Content-Type": "application/json" },
});