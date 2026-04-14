import axios from "axios";
import { register, login, getMe, logout } from "./authApi";

jest.mock("axios");

describe("authApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("register API success", async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });

        const res = await register("test@test.com", "pass");

        expect(res).toEqual({ id: 1 });
        expect(axios.post).toHaveBeenCalledWith("/users/", {
            email: "test@test.com",
            password: "pass",
        });
    });

    test("login stores token", async () => {
        axios.post.mockResolvedValue({
            data: { access: "a", refresh: "r" },
        });

        const res = await login("test@test.com", "pass");

        expect(res.access).toBe("a");
        expect(localStorage.getItem("access")).toBe("a");
        expect(localStorage.getItem("refresh")).toBe("r");
    });

    test("getMe fetches user", async () => {
        axios.get.mockResolvedValue({ data: { id: 1 } });

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