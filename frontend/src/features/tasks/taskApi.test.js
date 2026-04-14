import { vi } from "vitest";

const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: {
        request: { use: vi.fn() },
    },
};

vi.mock("axios", () => ({
    default: {
        create: () => mockAxiosInstance,
    },
}));

import { fetchTasks, createTask, deleteTask } from "./taskApi";

describe("taskApi", () => {
    beforeEach(() => {
        localStorage.setItem("token", "test");
        vi.clearAllMocks();
    });

    test("fetchTasks", async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: [{ id: 1 }] });

        const res = await fetchTasks(1);

        expect(res).toEqual([{ id: 1 }]);
    });

    test("createTask", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

        const res = await createTask(1, { title: "task" });

        expect(res).toEqual({ id: 1 });
    });

    test("deleteTask", async () => {
        mockAxiosInstance.delete.mockResolvedValue({});

        await deleteTask(1, 2);

        expect(mockAxiosInstance.delete).toHaveBeenCalled();
    });
});