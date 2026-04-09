import useTasks from "./api/useTasks";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

export default function Tasks() {
    const taskState = useTasks();

    return (
        <div>
            <h2>タスク管理</h2>

            <TaskForm {...taskState} />

            {taskState.error && <p>{taskState.error}</p>}

            <TaskList {...taskState} />
        </div>
    );
}