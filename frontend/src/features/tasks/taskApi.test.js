import axios from "axios";
import { fetchTasks, createTask, deleteTask } from "./taskApi";

jest.mock("axios");

describe("taskApi", () => {
    beforeEach(() => {
        localStorage.setItem("token", "test-token");
    });

    test("fetchTasks", async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1 }] });

        const res = await fetchTasks(1);

        expect(res).toEqual([{ id: 1 }]);
    });

    test("createTask", async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });

        const res = await createTask(1, { title: "task" });

        expect(res).toEqual({ id: 1 });
    });

    test("deleteTask", async () => {
        axios.delete.mockResolvedValue({});

        await deleteTask(1, 2);

        expect(axios.delete).toHaveBeenCalled();
    });
});