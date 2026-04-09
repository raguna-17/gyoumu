import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "./projectApi";
import { useNavigate, Link } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch {
            setError("プロジェクト取得に失敗しました");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async () => {
        if (!name) {
            alert("プロジェクト名は必須です");
            return;
        }
        try {
            await createProject(name, desc);
            setName("");
            setDesc("");
            fetchProjects();
        } catch {
            alert("プロジェクト作成に失敗しました");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("本当に削除しますか？")) return;
        try {
            await deleteProject(id);
            fetchProjects();
        } catch {
            alert("プロジェクト削除に失敗しました");
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (
        <div>
            <h2>プロジェクト管理</h2>

            <button onClick={logout} style={{ marginBottom: "10px" }}>ログアウト</button>

            <div style={{ marginBottom: "20px" }}>
                <h3>新規プロジェクト作成</h3>
                <input placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="説明" value={desc} onChange={(e) => setDesc(e.target.value)} />
                <button onClick={handleCreate}>作成</button>
            </div>

            {error && <p>{error}</p>}

            <ul>
                {projects.length === 0 && <li>プロジェクトはありません</li>}
                {projects.map(p => (
                    <li key={p.id}>
                        <strong>{p.name}</strong> - {p.description}
                        <button onClick={() => handleDelete(p.id)} style={{ color: "red", marginLeft: "10px" }}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}