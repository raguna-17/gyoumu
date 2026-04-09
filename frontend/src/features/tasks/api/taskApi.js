import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("access_token");

export const getTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks/`, {
        headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
};

export const createTask = async (project_id, name, description) => {
    const response = await axios.post(
        `${API_URL}/tasks/`,
        { project_id, name, description },
        { headers: { Authorization: `Bearer ${token()}` } }
    );
    return response.data;
};

// PATCH で部分更新
export const patchTask = async (id, updates) => {
    const response = await axios.patch(`${API_URL}/tasks/${id}/`, updates, {
        headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
};