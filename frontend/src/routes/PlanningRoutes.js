import axios from 'axios';

const API_URL = 'http://localhost:8080/planning';

export const createPlanning = async (data) => axios.post(API_URL, data);
export const patchPlanning = async (id, field, value) => axios.patch(`${API_URL}/${id}`, { [field]: value });
export const getOnePlanningByID = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getAllPlannings = async () => axios.get(API_URL);

