import { useTasksContext } from '../../store'
import { Taskslist } from '../../types'

const ExportTasksJsonButton = () => {
  const {tasksList} = useTasksContext()

  const exportTasks = (tasks: Taskslist[]) => {
    const jsonData = JSON.stringify(tasks, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tasks.json'
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    exportTasks(tasksList)
  }

  return (
    <button onClick={handleExport}>Export Tasks</button>
  )
}

export default ExportTasksJsonButton