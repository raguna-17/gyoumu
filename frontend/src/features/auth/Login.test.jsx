import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "./Login";
import * as authApi from "../auth/authApi";

describe("Login コンポーネント", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it("正常系: ログイン成功で tokens が localStorage に保存される", async () => {
        vi.spyOn(authApi, "loginUser").mockResolvedValue({ access: "access_token", refresh: "refresh_token" });

        render(<Login />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });

        fireEvent.click(screen.getByRole("button", { name: /ログイン/i }));

        await waitFor(() => {
            expect(localStorage.getItem("access_token")).toBe("access_token");
            expect(localStorage.getItem("refresh_token")).toBe("refresh_token");
        });
    });

    it("異常系: ログイン失敗時に alert が表示される", async () => {
        vi.spyOn(authApi, "loginUser").mockRejectedValue(new Error("ログイン失敗"));
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<Login />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "wrongpass" } });

        fireEvent.click(screen.getByRole("button", { name: /ログイン/i }));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("ログインに失敗しました");
        });
    });
});