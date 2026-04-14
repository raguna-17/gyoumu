import { vi, describe, test, expect, beforeEach } from "vitest";

/* =========================
   axios mock（ホイスティング回避）
========================= */
vi.mock("axios", () => {
    const mockAxiosInstance = {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        interceptors: {
            request: {
                use: vi.fn((fn) => fn),
            },
        },
    };

    return {
        default: {
            create: vi.fn(() => mockAxiosInstance),
        },
    };
});

/* =========================
   importはmockの後
========================= */
import { register, login, getMe, logout } from "./authApi";

/* =========================
   テスト内で参照したい場合
   → 外に出さない（重要）
========================= */

describe("authApi", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test("register", async () => {
        const res = await register("test@test.com", "pass");
        expect(res).toBeDefined();
    });

    test("login stores tokens", async () => {
        await login("test@test.com", "pass");

        expect(localStorage.getItem("access")).toBeDefined();
        expect(localStorage.getItem("refresh")).toBeDefined();
    });

    test("logout clears tokens", () => {
        localStorage.setItem("access", "a");
        localStorage.setItem("refresh", "r");

        logout();

        expect(localStorage.getItem("access")).toBeNull();
        expect(localStorage.getItem("refresh")).toBeNull();
    });
});