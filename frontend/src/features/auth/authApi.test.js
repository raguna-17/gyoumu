import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// localStorage モック（jsdom前提でも安全にする保険）
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => (store[key] = value),
        removeItem: (key) => delete store[key],
        clear: () => (store = {}),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

// axiosモック
vi.mock("axios", () => {
    const post = vi.fn();
    const get = vi.fn();

    return {
        default: {
            create: () => ({
                post,
                get,
                interceptors: {
                    request: {
                        use: vi.fn((fn) => fn),
                    },
                },
            }),
        },
    };
});

// テスト対象（mockより後にimportするのが重要）
import { register, login, getMe, logout } from "./authApi";

describe("authApi", () => {
    let mockAxios;

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();

        mockAxios = axios.create();
    });

    // =====================
    // register
    // =====================
    it("register: API呼び出し & access削除", async () => {
        mockAxios.post.mockResolvedValueOnce({
            data: { id: 1, email: "test@test.com" },
        });

        localStorage.setItem("access", "old-token");

        const result = await register("test@test.com", "pass");

        expect(mockAxios.post).toHaveBeenCalledWith("/users/", {
            email: "test@test.com",
            password: "pass",
        });

        expect(result.email).toBe("test@test.com");
        expect(localStorage.getItem("access")).toBe(null);
    });

    // =====================
    // login
    // =====================
    it("login: token保存される", async () => {
        mockAxios.post.mockResolvedValueOnce({
            data: {
                access: "access-token",
                refresh: "refresh-token",
            },
        });

        const result = await login("test@test.com", "pass");

        expect(mockAxios.post).toHaveBeenCalledWith("/auth/token/", {
            email: "test@test.com",
            password: "pass",
        });

        expect(localStorage.getItem("access")).toBe("access-token");
        expect(localStorage.getItem("refresh")).toBe("refresh-token");
        expect(result.access).toBe("access-token");
    });

    // =====================
    // getMe
    // =====================
    it("getMe: ユーザー情報取得", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { id: 1, email: "me@test.com" },
        });

        const result = await getMe();

        expect(mockAxios.get).toHaveBeenCalledWith("/users/me/");
        expect(result.email).toBe("me@test.com");
    });

    // =====================
    // logout
    // =====================
    it("logout: localStorage削除", () => {
        localStorage.setItem("access", "a");
        localStorage.setItem("refresh", "b");

        logout();

        expect(localStorage.getItem("access")).toBe(null);
        expect(localStorage.getItem("refresh")).toBe(null);
    });
});