import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// token
const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
});

// 一覧取得


export const fetchTasks = async (projectId) => {
    const res = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/tasks/`,
        getAuthHeader()
    );
    return res.data;
};

// 作成
export const createTask = async (projectId, data) => {
    const res = await axios.post(
        `${API_BASE_URL}/projects/${projectId}/tasks/`,
        data,
        getAuthHeader()
    );
    return res.data;
};

// 削除
export const deleteTask = async (projectId, taskId) => {
    await axios.delete(
        `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/`,
        getAuthHeader()
    );
};