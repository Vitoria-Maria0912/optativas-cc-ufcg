import axios from 'axios';

const API_URL = 'http://localhost:8080/planning';

export const createPlanning = async (data) => {
    const token = localStorage.getItem("token");
    return axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const putPlanning = async (updatedFields) => {
    return axios.put(`${API_URL}`, updatedFields);
};
export const getOnePlanningByID = async (id) => axios.get(`${API_URL}/getByID/${id}`);
export const getAllPlannings = async () => axios.get(API_URL);

