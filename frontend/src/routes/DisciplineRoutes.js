import axios from 'axios';

const API_URL = 'http://localhost:8080/disciplines';
const API_URL_PROTECTED = 'http://localhost:8080/protected/disciplines';

export const createDisciplineRoute = async (data) => axios.post(API_URL_PROTECTED, data);
export const deleteAllDisciplinesRoute = async () => axios.delete(API_URL_PROTECTED);
export const deleteDisciplineRoute = async (id) => axios.delete(`${API_URL_PROTECTED}/${id}`);
export const patchDisciplineRoute = async (id, field, value) => axios.patch(`${API_URL_PROTECTED}/${id}`, { [field]: value });
export const putDisciplineRoute = async (id, data) => axios.put(`${API_URL_PROTECTED}/${id}`, data);
export const getOneDisciplineByIDRoute = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getOneDisciplineByNameRoute = async (name) => axios.get(`${API_URL}/getByName/${encodeURIComponent(name)}`);
export const getOneDisciplineByAcronymRoute = async (acronym) => axios.get(`${API_URL}/getByAcronym/${encodeURIComponent(acronym)}`);
export const getAllDisciplinesRoute = async () => axios.get(API_URL);

