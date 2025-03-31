import axios from 'axios';

const API_URL = 'http://localhost:8080/users';
const PROTECTED_API_URL = 'http://localhost:8080/protected/users';

export const createUser = async (data) => axios.post(API_URL, data);
export const deleteAllUsers = async () => axios.delete(PROTECTED_API_URL);
export const deleteUser = async (id) => axios.delete(`${API_URL}/${id}`);
export const patchUser = async (id, field, value) => axios.patch(`${API_URL}/${id}`, { [field]: value });
export const getOneUserByID = async (id) => axios.get(`${PROTECTED_API_URL}/getByID/${id}`);
export const getOneUserByEmail = async (email) => axios.get(`${API_URL}/getByEmail/${encodeURIComponent(email)}`);
export const getOneUserByRole = async (role) => axios.get(`${API_URL}/getByAcronym/${encodeURIComponent(role)}`);
export const getAllUsers = async () => axios.get(PROTECTED_API_URL);

