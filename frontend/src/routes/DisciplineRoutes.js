import axios from 'axios';

const API_URL = 'http://localhost:8080/disciplines';
const API_URL_PROTECTED = 'http://localhost:8080/protected/disciplines';

export const createDisciplineRoute = async (data) => axios.post(API_URL_PROTECTED, data, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const deleteAllDisciplinesRoute = async () => axios.delete(API_URL_PROTECTED, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const deleteDisciplineRoute = async (id) => axios.delete(`${API_URL_PROTECTED}/${id}`, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const patchDisciplineRoute = async (id, field, value) => axios.patch(`${API_URL_PROTECTED}/${id}`, { [field]: value }, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const putDisciplineRoute = async (id, data) => axios.put(`${API_URL_PROTECTED}/${id}`, data, { headers : { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
export const getOneDisciplineByIDRoute = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getOneDisciplineByNameRoute = async (name) => axios.get(`${API_URL}/getByName/${encodeURIComponent(name)}`);
export const getOneDisciplineByAcronymRoute = async (acronym) => axios.get(`${API_URL}/getByAcronym/${encodeURIComponent(acronym)}`);
export const getAllDisciplinesRoute = async () => axios.get(`${API_URL}?page=1&limit=1000`);

