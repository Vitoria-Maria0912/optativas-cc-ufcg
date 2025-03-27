import axios from 'axios';

const API_URL = 'http://localhost:8080/disciplines';
const API_URL_PROTECTED = 'http://localhost:8080/protected/disciplines';

export const createDiscipline = async (data) => axios.post(API_URL_PROTECTED, data);
export const deleteAllDisciplines = async () => axios.delete(API_URL_PROTECTED);
export const deleteDiscipline = async (id) => axios.delete(`${API_URL_PROTECTED}/${id}`);
export const patchDiscipline = async (id, field, value) => axios.patch(`${API_URL_PROTECTED}/${id}`, { [field]: value });
export const putDiscipline = async (id, data) => axios.put(`${API_URL_PROTECTED}/${id}`, data);
export const getOneDisciplineByID = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getOneDisciplineByName = async (name) => axios.get(`${API_URL}/getByName/${encodeURIComponent(name)}`);
export const getOneDisciplineByAcronym = async (acronym) => axios.get(`${API_URL}/getByAcronym/${encodeURIComponent(acronym)}`);
export const getAllDisciplines = async () => axios.get(API_URL);

