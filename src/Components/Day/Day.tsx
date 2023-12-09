import { useState, useEffect } from 'react'
import { DayInfo } from "../../types" 
import { useTasksContext } from "../../store"
import Modal from "../Modal/Modal"
import Task from "../Task/Task"
import './Day.scss'

function Day({ dayInfo}: { dayInfo: DayInfo }) {
  const {tasksList, setTasksList} = useTasksContext()
  const [openModal, setOpenModal] = useState<Boolean>(false)
  const [taskText, setTaskText] = useState<string>('')

  const openModalHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenModal(true)
  }

  const addTaskHandler = (dayInfo: DayInfo) => {
    const newTask = {
      date: dayInfo.fullDate,
      tasks: [...(tasksList.find(task => task.date === dayInfo.fullDate)?.tasks || []), 
      { date: dayInfo.fullDate, text: taskText, labels: ['blue'] }],
    }

    setTasksList((prevTasksList) => [...prevTasksList.filter(task => task.date !== dayInfo.fullDate), newTask])
    setTaskText('')
  }

  useEffect(() => {
    if (taskText) {
      addTaskHandler(dayInfo)
    }
  }, [taskText])

  return (
    <>
      <li className={`${dayInfo.inactive ? 'inactive' : ''} ${dayInfo.active ? 'active' : ''} day-cell`}>
        <div className='day-header'>
          <div className='day-number'>{dayInfo.day}</div>
          <img src="./plus-icon.png" alt="add item"  className='add-item-icon' onClick={(e) => {openModalHandler(e)}} />
        </div>
        {tasksList.find(task => task.date === dayInfo.fullDate)?.tasks.map((task, index) => 
          <div key={index}>
            <Task text={task.text} labels={task.labels} day={dayInfo}/>
          </div>
        )}
      </li>
      {openModal && <Modal setTaskText={setTaskText} setOpenModal={setOpenModal}/>}
    </>
  )
}

export default Day
