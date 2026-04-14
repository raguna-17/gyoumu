import { vi } from "vitest";

/* axios完全モック */
const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    interceptors: {
        request: {
            use: vi.fn(),
        },
    },
};

vi.mock("axios", () => {
    return {
        default: {
            create: () => mockAxiosInstance,
        },
    };
});

import axios from "axios";
import { register, login, getMe, logout } from "./authApi";

describe("authApi", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test("register", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

        const res = await register("test@test.com", "pass");

        expect(res).toEqual({ id: 1 });
        expect(mockAxiosInstance.post).toHaveBeenCalled();
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

    test("logout", () => {
        localStorage.setItem("access", "a");
        localStorage.setItem("refresh", "r");

        logout();

        expect(localStorage.getItem("access")).toBeNull();
    });
});