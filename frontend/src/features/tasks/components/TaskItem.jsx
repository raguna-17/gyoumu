export default function TaskItem({
    task,
    progressInputs,
    progressErrors,
    assigneeInputs,
    assigneeErrors,
    onProgressChange,
    onStatusChange,
    onAssigneeChange,
    handleDelete
}) {
    return (
        <li>
            <strong>{task.name}</strong> [{task.status}] - {task.project.name}

            <br />

            進捗:
            <input
                value={progressInputs[task.id] ?? ""}
                onChange={(e) => onProgressChange(task.id, e.target.value)}
            />
            %
            {progressErrors[task.id] && <span>{progressErrors[task.id]}</span>}

            <br />

            <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
            >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
            </select>

            <br />

            担当者:
            <input
                value={assigneeInputs[task.id] ?? ""}
                onChange={(e) => onAssigneeChange(task.id, e.target.value)}
            />
            {assigneeErrors[task.id] && <span>{assigneeErrors[task.id]}</span>}

            <br />

            <button onClick={() => handleDelete(task.id)}>
                削除
            </button>
        </li>
    );
}