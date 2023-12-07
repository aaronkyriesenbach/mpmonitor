import axios from "axios";
import { Provider } from "./constants";

const API_URL = "http://localhost:5000";

export function getUser(userId: string) {
  return axios.get(`${API_URL}/user/${userId}`);
}

export function createUser(
  userId: string,
  firstName: string,
  provider: Provider
) {
  return axios.post(`${API_URL}/user/${userId}`, {
    firstName: firstName,
    provider: provider,
  });
}

export function getUserQueries(userId: string) {
  return axios.get(`${API_URL}/user/${userId}/queries`);
}

export function deleteQuery(queryId: number) {
  return axios.delete(`${API_URL}/query/${queryId}`);
}

export function createQuery(userId: string, query: string) {
  return axios.post(`${API_URL}/user/${userId}/queries`, {
    query: query,
  });
}
