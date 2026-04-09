import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../features/projects/projectApi";
import { getUsers } from "../../features/auth/authApi";

const Sidebar = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const projectData = await getProjects();
                setProjects(projectData);

                const userData = await getUsers();
                setUsers(userData);

            } catch (err) {
                console.error("取得失敗", err);
            }
        }
        fetchData();
    }, []);

    return (
        <aside style={{
            width: "200px",
            background: "#222",
            color: "#fff",
            padding: "20px"
        }}>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                    <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                </li>
                <li>
                    <Link to="/tasks" style={{ color: "#fff" }}>Tasks</Link>
                </li>
                <li>
                    <Link to="/projects" style={{ color: "#fff" }}>Projects</Link>
                </li>

                {/* プロジェクト */}
                {projects.length > 0 && (
                    <>
                        <li style={{ marginTop: "40px", fontWeight: "bold" }}>
                            プロジェクト
                        </li>
                        {projects.map(p => (
                            <li key={p.id}>
                                <Link
                                    to={`/tasks?projectId=${p.id}`}
                                    style={{ color: "#fff", fontSize: "0.9em" }}
                                >
                                    {p.name} (ID: {p.id})
                                </Link>
                            </li>
                        ))}
                    </>
                )}

                {/* ユーザー */}
                {users.length > 0 && (
                    <>
                        <li style={{ marginTop: "40px", fontWeight: "bold" }}>
                            ユーザー
                        </li>
                        {users.map(u => (
                            <li key={u.id}>
                                <span style={{ fontSize: "0.9em" }}>
                                    ID: {u.id}
                                </span>
                            </li>
                        ))}
                    </>
                )}
            </ul>
        </aside>
    );
};

export default Sidebar;