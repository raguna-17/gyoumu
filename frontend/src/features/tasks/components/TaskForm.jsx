export default function TaskForm({
    projectId,
    setProjectId,
    newTaskName,
    setNewTaskName,
    newTaskDesc,
    setNewTaskDesc,
    handleCreate
}) {
    return (
        <div>
            <h3>新規作成</h3>

            <input
                placeholder="プロジェクトID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
            />

            <input
                placeholder="タスク名"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
            />

            <input
                placeholder="説明"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
            />

            <button onClick={handleCreate}>
                作成
            </button>
        </div>
    );
}