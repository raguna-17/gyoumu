import { useEffect, useState } from "react";
import { getTasks, createTask, patchTask, deleteTask } from "./taskApi";
import { getUserById } from "../../auth/authApi";

export default function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [projectId, setProjectId] = useState("");

    const [progressInputs, setProgressInputs] = useState({});
    const [progressErrors, setProgressErrors] = useState({});

    const [assigneeInputs, setAssigneeInputs] = useState({});
    const [assigneeErrors, setAssigneeErrors] = useState({});

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);

            const p = {};
            const a = {};

            data.forEach(t => {
                p[t.id] = t.progress ?? "";
                a[t.id] = t.assigned_to?.id ?? "";
            });

            setProgressInputs(p);
            setAssigneeInputs(a);

        } catch {
            setError("タスク取得に失敗しました");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreate = async () => {
        if (!projectId || !newTaskName) return;

        await createTask(projectId, newTaskName, newTaskDesc);

        setNewTaskName("");
        setNewTaskDesc("");
        fetchTasks();
    };

    const handleUpdate = async (taskId, updates) => {
        await patchTask(taskId, updates);

        setTasks(prev =>
            prev.map(t =>
                t.id === taskId ? { ...t, ...updates } : t
            )
        );
    };

    const handleDelete = async (taskId) => {
        if (!confirm("削除する？")) return;

        await deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const validateProgress = (value) => {
        if (!/^\d+$/.test(value)) return "整数";
        const num = Number(value);
        if (num < 0 || num > 100) return "0〜100";
        return "";
    };

    const validateUserId = (value) => {
        if (value === "") return "";
        if (!/^\d+$/.test(value)) return "数字のみ";
        return "";
    };

    const onProgressChange = (id, value) => {
        setProgressInputs(p => ({ ...p, [id]: value }));

        const err = validateProgress(value);
        setProgressErrors(e => ({ ...e, [id]: err }));

        if (!err) {
            handleUpdate(id, { progress: Number(value) });
        }
    };

    const onStatusChange = (id, value) => {
        handleUpdate(id, { status: value });
    };

    const onAssigneeChange = async (id, value) => {
        setAssigneeInputs(a => ({ ...a, [id]: value }));

        const err = validateUserId(value);
        if (err) {
            setAssigneeErrors(e => ({ ...e, [id]: err }));
            return;
        }

        if (value === "") {
            setAssigneeErrors(e => ({ ...e, [id]: "" }));
            handleUpdate(id, { assigned_to: null });
            return;
        }

        try {
            await getUserById(value);

            setAssigneeErrors(e => ({ ...e, [id]: "" }));

            handleUpdate(id, {
                assigned_to: parseInt(value)
            });

        } catch {
            setAssigneeErrors(e => ({
                ...e,
                [id]: "存在しない"
            }));
        }
    };

    return {
        tasks,
        error,

        projectId,
        setProjectId,
        newTaskName,
        setNewTaskName,
        newTaskDesc,
        setNewTaskDesc,

        progressInputs,
        progressErrors,
        assigneeInputs,
        assigneeErrors,

        handleCreate,
        onProgressChange,
        onStatusChange,
        onAssigneeChange,
        handleDelete
    };
}