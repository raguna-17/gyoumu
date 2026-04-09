import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("access_token");

export const getProjects = async () => {
    const response = await axios.get(`${API_URL}/projects/`, {
        headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
};

export const createProject = async (name, description) => {
    const response = await axios.post(
        `${API_URL}/projects/`,
        { name, description },
        { headers: { Authorization: `Bearer ${token()}` } }
    );
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await axios.delete(`${API_URL}/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
};