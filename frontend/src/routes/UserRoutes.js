import axios from 'axios';

const API_URL = 'http://localhost:8080/users';
const PROTECTED_API_URL = 'http://localhost:8080/protected/users';

export const createUserRoute = async (data) => axios.post(`${ API_URL }`, data);
export const deleteAllUsersRoute = async () => axios.delete(PROTECTED_API_URL, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const deleteUserRoute = async (id) => axios.delete(`${API_URL}/${id}`);
export const patchUserRoute = async (id, field, value) => axios.patch(`${API_URL}/${id}`, { [field]: value });
export const getOneUserByIDRoute = async (id) => axios.get(`${PROTECTED_API_URL}/getByID/${id}`, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const getOneUserByEmailRoute = async (email) => axios.get(`${API_URL}/getByEmail/${encodeURIComponent(email)}`);
export const getOneUserByRoleRoute = async (role) => axios.get(`${API_URL}/getByAcronym/${encodeURIComponent(role)}`);
export const getAllUsersRoute = async () => axios.get(PROTECTED_API_URL, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });

