import React, { useState } from 'react'
import { useTasksContext } from '../../store'
import './Task.scss'
import LabelMenu from '../LabelMenu/LebelMenu'
import { DayInfo } from '../../types'

const Task = ({ text, labels, day }: { text: string, labels: string[], day: DayInfo }) => {
  const {tasksList, setTasksList} = useTasksContext()
  const [isEditing, setIsEditing] = useState<Boolean>(false)
  const [editedText, setEditedText] = useState<string>(text)
  
  const deleteTaskHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newTasksList = tasksList.map(task => {
      if (task.tasks.find(task => task.date === day.fullDate)) {
        return {
          date: task.date,
          tasks: task.tasks.filter(task => task.text !== text)
        }
      }
      return task
    })

    setTasksList(newTasksList)
  }

  const saveEditHandler = () => {
    const newTasksList = tasksList.map(task => {
      if (task.tasks.find(task => task.date === day.fullDate)) {
        return {
          date: task.date,
          tasks: task.tasks.map(task => {
            if (task.text === text) {
              return {
                date: task.date,
                text: editedText,
                labels: task.labels
              }
            }
            return task
          })
        }
      }
      return task
    })

    setTasksList(newTasksList)
    setIsEditing(false)
  }

  const editTextHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

    return (
      <div className='task'>
        <div className='labels-wrapper'>
          {labels.map((label, index) => <div key={index} className='label' style={{backgroundColor: `${label}`}}></div>)}
        </div>
        <div className='task-wrapper'>
          {isEditing && isEditing 
          ? <input 
              type="text" className='edit-input' 
              value={editedText} 
              onChange={(e) => {setEditedText(e.target.value)}} 
              onBlur={saveEditHandler}  
              onKeyDown={(e) => {if (e.key === 'Enter') saveEditHandler()}}        
            />
          : <div className="task-text" onClick={editTextHandler}>{text}</div>}
          <div className='edit-panel'>
            <LabelMenu labels={labels} day={day}/>
            <img src="./edit_pen_icon.png" alt="edit task" className='edit-task' onClick={editTextHandler}/>
            <img src="./4879885-32.png" alt="delete task" className='delete-task' onClick={deleteTaskHandler}/>
          </div>
        </div>
      </div>
    )
}

export default Task