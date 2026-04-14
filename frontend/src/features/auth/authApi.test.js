import axios from "axios";
import { vi } from "vitest";
import { register, login, getMe, logout } from "./authApi";

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

describe("authApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("register API success", async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });

        const res = await register("test@test.com", "pass");

        expect(res).toEqual({ id: 1 });
    });

    test("login stores token", async () => {
        axios.post.mockResolvedValue({
            data: { access: "a", refresh: "r" },
        });

        await login("test@test.com", "pass");

        expect(localStorage.getItem("access")).toBe("a");
        expect(localStorage.getItem("refresh")).toBe("r");
    });

    test("logout clears tokens", () => {
        localStorage.setItem("access", "a");
        localStorage.setItem("refresh", "r");

        logout();

        expect(localStorage.getItem("access")).toBeNull();
    });
});