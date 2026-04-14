import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
// トークン自動付与
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// =====================
// ユーザー登録
// =====================
export const register = async (email, password) => {
    localStorage.removeItem("access"); // ←これ追加

    const res = await API.post("/users/", {
        email,
        password,
    });
    return res.data;
  };

// =====================
// ログイン（JWT取得）
// =====================
export const login = async (email, password) => {
    const res = await API.post("/auth/token/", {
        email, // ←ここだけ変える
        password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    return res.data;
  };

// =====================
// 自分の情報取得
// =====================
export const getMe = async () => {
    const res = await API.get("/users/me/");
    return res.data;
};

// =====================
// ログアウト
// =====================
export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};