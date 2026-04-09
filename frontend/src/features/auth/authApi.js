import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ユーザー登録
export const registerUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/users/`, { email, password });
    return response.data;
};

// ログイン
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/token/`, { email, password });
    return response.data;
};

// ユーザー一覧取得
export const getUsers = async () => {
    const token = localStorage.getItem("access_token");

    const res = await axios.get(`${API_URL}/users/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

// ★ これを追加
export const getUserById = async (id) => {
    const token = localStorage.getItem("access_token");

    const res = await axios.get(`${API_URL}/users/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};