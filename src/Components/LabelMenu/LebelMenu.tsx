import { useTasksContext } from '../../store'
import { DayInfo } from '../../types'
import './LabelMenu.scss'
import uuid from 'react-uuid'

const LabelMenu = ({ id, labels, day }: { id: string, labels: string[], day: DayInfo} ) => {
  const {tasksList, setTasksList, labelsArray} = useTasksContext()

  const labelEditHandler = (e: React.MouseEvent ,label: string) => {
    e.preventDefault()
    e.stopPropagation()
    const newTasksList = tasksList.map(task => {
      if (task.tasks.find(task => task.date === day.fullDate)) {
        return {
          date: task.date,
          tasks: task.tasks.map(task => {
            if (task.id === id) {
              const updatedLabels = labels.includes(label)
                ? task.labels.length > 1
                  ? task.labels.filter(existingLabel => existingLabel !== label)
                  : task.labels
                : [...task.labels, label]

              return {
                id: task.id,
                date: task.date,
                text: task.text,
                labels: updatedLabels,
              };
            }
            return task
          }),
        };
      }
      return task
    })

    setTasksList(newTasksList);
  };

  return (
    <div className="color-menu">
      <button className='colorChange-button'></button>
      <ul className='drop-down-colors'>
        {labelsArray.map((label) => 
          <li 
            key={uuid()} 
            className={`color-item ${labels.includes(label) && 'color-item--active'}`} 
            style={{backgroundColor: `${label}`}}
            onClick={(e) => labelEditHandler(e, label)}
          >
          </li>
        )}
      </ul>
    </div>
  )
}

export default LabelMenu