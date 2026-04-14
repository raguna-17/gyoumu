import { vi } from "vitest";

const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

import {
    fetchProjects,
    createProject,
    fetchProject,
    updateProject,
    deleteProject,
} from "./projectApi";

describe("projectApi", () => {
    beforeEach(() => {
        localStorage.setItem("token", "test");
        vi.clearAllMocks();
    });

    test("fetchProjects", async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: [{ id: 1 }] });

        const res = await fetchProjects();

        expect(res).toEqual([{ id: 1 }]);
    });

    test("createProject", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

        const res = await createProject({ name: "test" });

        expect(res).toEqual({ id: 1 });
    });

    test("fetchProject", async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: { id: 1 } });

        const res = await fetchProject(1);

        expect(res.id).toBe(1);
    });

    test("updateProject", async () => {
        mockAxiosInstance.put.mockResolvedValue({ data: { id: 1 } });

        const res = await updateProject(1, { name: "new" });

        expect(res.id).toBe(1);
    });

    test("deleteProject", async () => {
        mockAxiosInstance.delete.mockResolvedValue({});

        await deleteProject(1);

        expect(mockAxiosInstance.delete).toHaveBeenCalled();
    });
});