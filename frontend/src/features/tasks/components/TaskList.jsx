import TaskItem from "./TaskItem";

export default function TaskList(props) {
    return (
        <ul>
            {props.tasks.map(task => (
                <TaskItem key={task.id} task={task} {...props} />
            ))}
        </ul>
    );
}