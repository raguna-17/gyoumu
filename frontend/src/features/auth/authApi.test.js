import { vi } from "vitest";

/* =========================
   axios完全モック（安全版）
========================= */
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

vi.mock("axios", () => {
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
   tests
========================= */
describe("authApi", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test("register", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

        const res = await register("test@test.com", "pass");

        expect(res).toEqual({ id: 1 });
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            "/users/",
            { email: "test@test.com", password: "pass" }
        );
    });

    test("login stores tokens", async () => {
        mockAxiosInstance.post.mockResolvedValue({
            data: { access: "a", refresh: "r" },
        });

        await login("test@test.com", "pass");

        expect(localStorage.getItem("access")).toBe("a");
        expect(localStorage.getItem("refresh")).toBe("r");
    });

    test("getMe", async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: { id: 1 } });

        const res = await getMe();

        expect(res).toEqual({ id: 1 });
    });

    test("logout clears tokens", () => {
        localStorage.setItem("access", "a");
        localStorage.setItem("refresh", "r");

        logout();

        expect(localStorage.getItem("access")).toBeNull();
        expect(localStorage.getItem("refresh")).toBeNull();
    });
});