import axios from "axios";
import { getTasks, createTask, patchTask, deleteTask } from "./taskApi";

vi.mock("axios");

describe("taskApi", () => {
    beforeEach(() => {
        localStorage.setItem("access_token", "test-token");
    });

    it("getTasks: 正常にデータ取得", async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1 }] });

        const data = await getTasks();

        expect(axios.get).toHaveBeenCalled();
        expect(data).toEqual([{ id: 1 }]);
    });

    it("createTask: 正常に作成", async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });

        const data = await createTask(1, "task", "desc");

        expect(axios.post).toHaveBeenCalled();
        expect(data).toEqual({ id: 1 });
    });

    it("patchTask: 更新できる", async () => {
        axios.patch.mockResolvedValue({ data: { id: 1, progress: 50 } });

        const data = await patchTask(1, { progress: 50 });

        expect(axios.patch).toHaveBeenCalled();
        expect(data.progress).toBe(50);
    });

    it("deleteTask: 削除できる", async () => {
        axios.delete.mockResolvedValue({ data: {} });

        const data = await deleteTask(1);

        expect(axios.delete).toHaveBeenCalled();
        expect(data).toEqual({});
    });
});