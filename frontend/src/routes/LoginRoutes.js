import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const createLoginRoute = async (data) => axios.post(`${API_URL}/auth/login`, data);
export const getTokenByUserEmailRoute = async (data) => axios.post(API_URL + 'login/getTokenByUserEmail', data);
export const getDefaultPlanning = async () => {
    const token = localStorage.getItem("token");
    console.log(token)

    return axios.get(`${API_URL}/planning/default`, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOSVNUUkFUT1IiLCJuYW1lIjoianV2aW5vIiwiZW1haWwiOiJqdXZpbm9AZ21haWwuY29tIiwiaWF0IjoxNzQzNzgwMDQxLCJleHAiOjE3NDM3ODM2NDF9.YLJC9rGdabxbLBbekD6p--MXO7Zawk1-zDkerQgd5go`,
        },
    });
}

