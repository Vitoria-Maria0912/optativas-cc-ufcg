import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const createLoginRoute = async (data) => axios.post(`${API_URL}/auth/login`, data);
export const getTokenByUserEmailRoute = async (data) => axios.post(API_URL + 'login/getTokenByUserEmail', data);

