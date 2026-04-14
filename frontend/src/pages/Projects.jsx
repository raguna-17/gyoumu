import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchProjects,
    createProject,
    deleteProject,
} from "../features/projects/projectApi";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name || name.trim().length < 2) {
            alert("プロジェクト名は2文字以上");
            return;
        }

        try {
            await createProject({ name, description });
            alert("作成成功");
            setName("");
            setDescription("");
            loadProjects();
        } catch (err) {
            console.error(err.response?.data);
            alert("作成失敗");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            loadProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoTasks = (id) => {
        navigate(`/projects/${id}/tasks`);
    };

    return (
        <div>
            <h1>Projects</h1>

            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="プロジェクト名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">作成</button>
            </form>

            <ul>
                {projects.length === 0 ? (
                    <p>プロジェクトがありません</p>
                ) : (
                    projects.map((p) => (
                        <li key={p.id}>
                            <strong
                                style={{ cursor: "pointer" }}
                                onClick={() => handleGoTasks(p.id)}
                            >
                                {p.name}
                            </strong>
                            {" - "}
                            {p.description}

                            <button onClick={() => handleGoTasks(p.id)}>
                                タスク
                            </button>

                            <button onClick={() => handleDelete(p.id)}>
                                削除
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Projects;