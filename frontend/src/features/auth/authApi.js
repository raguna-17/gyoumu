import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

if (import.meta.env.DEV) {
    console.log("API baseURL:", import.meta.env.VITE_API_URL);
}

// トークン付与
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// =====================
// 共通エラーハンドラ
// =====================
const handleError = (err) => {
    const data = err.response?.data;

    return {
        error: true,
        status: err.response?.status,
        data,
    };
};

// =====================
// ユーザー登録
// =====================
export const register = async (email, password) => {
    try {
        localStorage.removeItem("access");

        const res = await API.post("/users/", {
            email,
            password,
        });

        return res.data;
    } catch (err) {
        throw handleError(err);
    }
};

// =====================
// ログイン
// =====================
export const login = async (email, password) => {
    try {
        const res = await API.post("/auth/token/", {
            email,
            password,
        });

        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        return res.data;
    } catch (err) {
        throw handleError(err);
    }
};

// =====================
// 自分の情報
// =====================
export const getMe = async () => {
    try {
        const res = await API.get("/users/me/");
        return res.data;
    } catch (err) {
        throw handleError(err);
    }
};

// =====================
// ログアウト
// =====================
export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};