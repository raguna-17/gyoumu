import { renderHook, act } from "@testing-library/react";
import useTasks from "./useTasks";

import * as api from "./taskApi";
import * as authApi from "../../auth/authApi";

vi.mock("./taskApi");
vi.mock("../../auth/authApi");

describe("useTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("初期ロードでタスク取得", async () => {
        api.getTasks.mockResolvedValue([
            { id: 1, progress: 10, assigned_to: { id: 2 } },
        ]);

        const { result } = renderHook(() => useTasks());

        // useEffect待ち
        await new Promise(r => setTimeout(r, 0));

        expect(result.current.tasks.length).toBe(1);
        expect(result.current.progressInputs[1]).toBe(10);
        expect(result.current.assigneeInputs[1]).toBe(2);
    });

    it("取得失敗でエラーセット", async () => {
        api.getTasks.mockRejectedValue(new Error());

        const { result } = renderHook(() => useTasks());

        await new Promise(r => setTimeout(r, 0));

        expect(result.current.error).toBe("タスク取得に失敗しました");
    });

    it("handleCreate: 作成してリセット", async () => {
        api.createTask.mockResolvedValue({});
        api.getTasks.mockResolvedValue([]);

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.setProjectId("1");
            result.current.setNewTaskName("task");
            result.current.setNewTaskDesc("desc");

            await result.current.handleCreate();
        });

        expect(api.createTask).toHaveBeenCalled();
        expect(result.current.newTaskName).toBe("");
    });

    it("onProgressChange: 正常値で更新呼ばれる", async () => {
        api.patchTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.onProgressChange(1, "50");
        });

        expect(api.patchTask).toHaveBeenCalledWith(1, { progress: 50 });
    });

    it("onProgressChange: 不正値でエラー", async () => {
        const { result } = renderHook(() => useTasks());

        await act(async () => {
            result.current.onProgressChange(1, "aaa");
        });

        expect(result.current.progressErrors[1]).toBe("整数");
    });

    it("onAssigneeChange: 存在するユーザー", async () => {
        authApi.getUserById.mockResolvedValue({});
        api.patchTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.onAssigneeChange(1, "2");
        });

        expect(api.patchTask).toHaveBeenCalledWith(1, {
            assigned_to: 2,
        });
    });

    it("onAssigneeChange: 存在しないユーザー", async () => {
        authApi.getUserById.mockRejectedValue(new Error());

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.onAssigneeChange(1, "999");
        });

        expect(result.current.assigneeErrors[1]).toBe("存在しない");
    });

    it("handleDelete: confirm OKなら削除", async () => {
        global.confirm = vi.fn(() => true);
        api.deleteTask.mockResolvedValue({});

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.handleDelete(1);
        });

        expect(api.deleteTask).toHaveBeenCalledWith(1);
    });

    it("handleDelete: confirm NGなら何もしない", async () => {
        global.confirm = vi.fn(() => false);

        const { result } = renderHook(() => useTasks());

        await act(async () => {
            await result.current.handleDelete(1);
        });

        expect(api.deleteTask).not.toHaveBeenCalled();
    });
});