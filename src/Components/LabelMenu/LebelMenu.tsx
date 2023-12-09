import { useTasksContext } from '../../store'
import { DayInfo } from '../../types'
import './LabelMenu.scss'

const LabelMenu = ({ labels, day }: {labels: string[], day: DayInfo} ) => {
  const {tasksList, setTasksList, labelsArray} = useTasksContext()

  const labelEditHandler = (label: string) => {

    const newTasksList = tasksList.map(task => {
      if (task.tasks.find(task => task.date === day.fullDate)) {
        return {
          date: task.date,
          tasks: task.tasks.map(task => {
            if (task.text === labels[0]) {
              return {
                date: task.date,
                text: task.text,
                labels: [label]
              }
            }
            return task
          })
        }
      }
      return task
    })

    setTasksList(newTasksList)
  }


  return (
    <div className="color-menu">
      <button className='colorChange-button'></button>
      <ul className='drop-down-colors'>
        {labelsArray.map((label, index) => 
          <li 
            key={index} 
            className={`color-item ${labels.includes(label) && 'color-item--active'}`} 
            style={{backgroundColor: `${label}`}}
            onClick={() => labelEditHandler(label)}
          >
          </li>
        )}
      </ul>
    </div>
  )
}

export default LabelMenu