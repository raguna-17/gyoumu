import axios from "axios";
import {
    fetchProjects,
    createProject,
    fetchProject,
    updateProject,
    deleteProject,
} from "./projectApi";

jest.mock("axios");

describe("projectApi", () => {
    beforeEach(() => {
        localStorage.setItem("token", "test-token");
    });

    test("fetchProjects", async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1 }] });

        const res = await fetchProjects();

        expect(res).toEqual([{ id: 1 }]);
    });

    test("createProject", async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });

        const res = await createProject({ name: "test" });

        expect(res).toEqual({ id: 1 });
    });

    test("fetchProject", async () => {
        axios.get.mockResolvedValue({ data: { id: 1 } });

        const res = await fetchProject(1);

        expect(res.id).toBe(1);
    });

    test("updateProject", async () => {
        axios.put.mockResolvedValue({ data: { id: 1 } });

        const res = await updateProject(1, { name: "new" });

        expect(res.id).toBe(1);
    });

    test("deleteProject", async () => {
        axios.delete.mockResolvedValue({});

        await deleteProject(1);

        expect(axios.delete).toHaveBeenCalled();
    });
});