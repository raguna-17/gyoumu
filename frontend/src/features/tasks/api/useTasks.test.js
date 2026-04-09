import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTasks from "./useTasks";

import * as taskApi from "./taskApi";
import * as authApi from "../../auth/authApi";

vi.mock("./taskApi");
vi.mock("../../auth/authApi");

describe("useTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("初期ロードでタスク取得される", async () => {
        taskApi.getTasks.mockResolvedValue([
            { id: 1, progress: 20, assigned_to: { id: 5 } },
        ]);

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.progressInputs[1]).toBe(20);
        expect(result.current.assigneeInputs[1]).toBe(5);
    });

    it("取得失敗時にエラーがセットされる", async () => {
        taskApi.getTasks.mockRejectedValue(new Error());

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe("タスク取得に失敗しました");
    });

    it("handleCreateでタスク作成＋入力リセット", async () => {
        taskApi.createTask.mockResolvedValue({});
        taskApi.getTasks.mockResolvedValue([]);

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.setProjectId("1");
            result.current.setNewTaskName("task");
            result.current.setNewTaskDesc("desc");

            await result.current.handleCreate();
        });

        expect(taskApi.createTask).toHaveBeenCalledWith("1", "task", "desc");
        expect(result.current.newTaskName).toBe("");
        expect(result.current.newTaskDesc).toBe("");
    });

    it("onProgressChange 正常値で更新される", async () => {
        taskApi.patchTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.onProgressChange(1, "50");
        });

        expect(taskApi.patchTask).toHaveBeenCalledWith(1, {
            progress: 50,
        });
    });

    it("onProgressChange 不正値でエラーになる", async () => {
        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.onProgressChange(1, "abc");
        });

        expect(result.current.progressErrors[1]).toBe("整数");
    });

    it("onAssigneeChange 正常ユーザーで更新", async () => {
        authApi.getUserById.mockResolvedValue({});
        taskApi.patchTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.onAssigneeChange(1, "3");
        });

        expect(taskApi.patchTask).toHaveBeenCalledWith(1, {
            assigned_to: 3,
        });
    });

    it("onAssigneeChange 存在しないユーザーでエラー", async () => {
        authApi.getUserById.mockRejectedValue(new Error());

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.onAssigneeChange(1, "999");
        });

        expect(result.current.assigneeErrors[1]).toBe("存在しない");
    });

    it("handleDelete confirm OKなら削除", async () => {
        global.confirm = vi.fn(() => true);
        taskApi.deleteTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.handleDelete(1);
        });

        expect(taskApi.deleteTask).toHaveBeenCalledWith(1);
    });

    it("handleDelete confirm NGなら何もしない", async () => {
        global.confirm = vi.fn(() => false);

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.handleDelete(1);
        });

        expect(taskApi.deleteTask).not.toHaveBeenCalled();
    });
});