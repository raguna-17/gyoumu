import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Register from "./Register";
import * as authApi from "../auth/authApi";

describe("Register コンポーネント", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("正常系: ユーザー登録成功でログイン画面に移動", async () => {
        vi.spyOn(authApi, "registerUser").mockResolvedValue({});
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<Register />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "new@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });

        fireEvent.click(screen.getByRole("button", { name: /登録/i }));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("ユーザー登録成功！ログイン画面に移動します");
        });
    });

    it("異常系: 既存ユーザーの場合エラーメッセージを表示", async () => {
        const error = { response: { status: 400, data: { email: "exists" } } };
        vi.spyOn(authApi, "registerUser").mockRejectedValue(error);
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<Register />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "exist@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });

        fireEvent.click(screen.getByRole("button", { name: /登録/i }));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("すでにこのユーザーは登録済みです");
        });
    });

    it("異常系: その他の登録失敗時に alert が表示される", async () => {
        vi.spyOn(authApi, "registerUser").mockRejectedValue(new Error("サーバーエラー"));
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<Register />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "fail@example.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });

        fireEvent.click(screen.getByRole("button", { name: /登録/i }));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("登録に失敗しました");
        });
    });
});