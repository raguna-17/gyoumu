import axios from "axios";
import { registerUser, loginUser, getUsers, getUserById } from "./authApi";

jest.mock("axios");

describe("authApi", () => {

    // registerUser
    describe("registerUser", () => {
        it("正常系: ユーザー登録成功", async () => {
            const mockData = { id: 1, email: "test@example.com" };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await registerUser("test@example.com", "password");
            expect(result).toEqual(mockData);
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/users/"),
                { email: "test@example.com", password: "password" }
            );
        });

        it("異常系: 登録失敗", async () => {
            axios.post.mockRejectedValue(new Error("登録エラー"));

            await expect(registerUser("test@example.com", "password"))
                .rejects.toThrow("登録エラー");
        });
    });

    // loginUser
    describe("loginUser", () => {
        it("正常系: ログイン成功", async () => {
            const mockData = { access: "token" };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await loginUser("test@example.com", "password");
            expect(result).toEqual(mockData);
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/token/"),
                { email: "test@example.com", password: "password" }
            );
        });

        it("異常系: ログイン失敗", async () => {
            axios.post.mockRejectedValue(new Error("ログイン失敗"));

            await expect(loginUser("test@example.com", "password"))
                .rejects.toThrow("ログイン失敗");
        });
    });

    // getUsers
    describe("getUsers", () => {
        it("正常系: ユーザー一覧取得成功", async () => {
            localStorage.setItem("access_token", "dummy_token");
            const mockData = [{ id: 1, email: "a@example.com" }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getUsers();
            expect(result).toEqual(mockData);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/users/"),
                { headers: { Authorization: "Bearer dummy_token" } }
            );
        });

        it("異常系: トークン無効", async () => {
            localStorage.setItem("access_token", "invalid_token");
            axios.get.mockRejectedValue(new Error("認証エラー"));

            await expect(getUsers()).rejects.toThrow("認証エラー");
        });
    });

    // getUserById
    describe("getUserById", () => {
        it("正常系: ユーザー取得成功", async () => {
            localStorage.setItem("access_token", "dummy_token");
            const mockData = { id: 1, email: "a@example.com" };
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getUserById(1);
            expect(result).toEqual(mockData);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/users/1/"),
                { headers: { Authorization: "Bearer dummy_token" } }
            );
        });

        it("異常系: ユーザーが存在しない", async () => {
            localStorage.setItem("access_token", "dummy_token");
            axios.get.mockRejectedValue(new Error("ユーザーが見つかりません"));

            await expect(getUserById(999)).rejects.toThrow("ユーザーが見つかりません");
        });
    });
});