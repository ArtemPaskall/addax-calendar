import { useTasksContext } from '../../store'
import './Task.scss'
import ColorMenu from '../ColorMenu/ColorMenu'

const Task = ({ text, labels }: { text: string, labels: string[] }) => {
  const {tasksList, setTasksList} = useTasksContext()


    return (
      <div className='task'>
        <div className='labels-wrapper'>
          {labels.map((label, index) => <div key={index} className='label' style={{backgroundColor: `${label}`}}></div>)}
        </div>
        <div className='task-wrapper'>
          <div className="task-text">{text}</div>
          <div className='edit-panel'>
            <ColorMenu labels={labels} />
            <img src="./edit_pen_icon.png" alt="edit task" className='edit-task' />
            <img src="./4879885-32.png" alt="delete task" className='delete-task' />
          </div>
        </div>
      </div>
    )
}

export default Task