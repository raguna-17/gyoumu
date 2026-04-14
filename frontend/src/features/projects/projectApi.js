import axios from "axios";

// Viteの環境変数
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/projects/`;

// token前提
const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// 一覧取得
export const fetchProjects = async () => {
    const res = await axios.get(API_URL, getAuthHeader());
    return res.data;
};

// 作成
export const createProject = async (data) => {
    const res = await axios.post(API_URL, data, getAuthHeader());
    return res.data;
};

// 詳細
export const fetchProject = async (id) => {
    const res = await axios.get(`${API_URL}${id}/`, getAuthHeader());
    return res.data;
};

// 更新
export const updateProject = async (id, data) => {
    const res = await axios.put(`${API_URL}${id}/`, data, getAuthHeader());
    return res.data;
};

// 削除
export const deleteProject = async (id) => {
    await axios.delete(`${API_URL}${id}/`, getAuthHeader());
};