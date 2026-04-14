import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchTasks,
    createTask,
    deleteTask,
} from "../features/tasks/taskApi";

const Tasks = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState("");
    const [status, setStatus] = useState("todo");
    const [progress, setProgress] = useState(0);

    const loadTasks = async () => {
        try {
            const data = await fetchTasks(projectId);
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (name.trim().length < 2) {
            alert("タスク名は2文字以上");
            return;
        }

        try {
            await createTask(projectId, {
                name,
                status,
                progress,
            });

            alert("作成成功");

            setName("");
            setProgress(0);
            setStatus("todo");

            loadTasks();
        } catch (err) {
            console.error(err.response?.data);
            alert("作成失敗");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(projectId, id);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Tasks</h1>

            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="タスク名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="todo">todo</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>

                <input
                    type="number"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                />

                <button type="submit">作成</button>
            </form>

            <ul>
                {tasks.map((t) => (
                    <li key={t.id}>
                        {t.name} ({t.status}) [{t.progress}%]
                        <button onClick={() => handleDelete(t.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;