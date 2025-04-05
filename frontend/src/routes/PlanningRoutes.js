import axios from 'axios';

const API_URL = 'http://localhost:8080/planning';

export const createPlanning = async (data) => axios.post(API_URL, data);
export const putPlanning = async (updatedFields) => {
    return axios.put(`${API_URL}`, updatedFields);
  };
export const getOnePlanningByID = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getAllPlannings = async () => axios.get(API_URL);

