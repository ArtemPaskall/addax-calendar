import { useState, useEffect } from 'react'
import { DayInfo } from "../../types" 
import { useTasksContext } from "../../store"
import Modal from "../Modal/Modal"
import Task from "../Task/Task"
import './Day.scss'
import uuid from 'react-uuid'
import Holidays from '../Holidays/Holidays'

function Day({ dayInfo}: { dayInfo: DayInfo }) {
  const { tasksList, 
    setTasksList, 
    currentDay, 
    setCurrentDay, 
    currentTaskId, 
    setCurrentTaskId, 
    searchByText, 
    searchByLabel } = useTasksContext()
  const [openModal, setOpenModal] = useState<Boolean>(false)
  const [taskText, setTaskText] = useState<string>('')

  const openModalHandler = (e: React.MouseEvent) => {
    setOpenModal(true)
  }

  const addTaskHandler = (dayInfo: DayInfo) => {
    const newTask = {
      date: dayInfo.fullDate,
      tasks: [...(tasksList.find(task => task.date === dayInfo.fullDate)?.tasks || []), 
      {id: uuid(), date: dayInfo.fullDate, text: taskText, labels: ['green'] }],
    }

    setTasksList((prevTasksList) => [...prevTasksList.filter(task => task.date !== dayInfo.fullDate), newTask])
    setTaskText('')
  }

  useEffect(() => {
    if (taskText) {
      addTaskHandler(dayInfo)
    }
  }, [taskText])

  const dragOverHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
  }

  const dropHandler = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    e.stopPropagation()

    let updatedTaskslist = tasksList.map(task => {
      if (currentDay && task.date === currentDay.fullDate) {
        return {
          date: task.date,
          tasks: task.tasks.filter(task => task.id !== currentTaskId)
        }
      }

      return task
    })

    const currentTask = tasksList.find(task => task.date === currentDay?.fullDate)?.tasks.find(task => task.id === currentTaskId)

    if (currentTask)  {
      const isNotEmptyDay = tasksList.find(task => task.date === dayInfo.fullDate)?.tasks
      if (isNotEmptyDay && dayInfo.fullDate !== currentDay?.fullDate) {
        updatedTaskslist = updatedTaskslist.map(task => {
          if (task.date === dayInfo.fullDate) {
            return {
              date: task.date,
              tasks: [...isNotEmptyDay, {...currentTask, date: dayInfo.fullDate}],
            }
          }

          return task
        })
      } else {
        const newTask = {
          date: dayInfo.fullDate,
          tasks: [{...currentTask, date: dayInfo.fullDate}]
        }

        updatedTaskslist.push(newTask)
      }
    }

    updatedTaskslist = updatedTaskslist.filter(task => task.tasks.length !== 0)

    setTasksList(updatedTaskslist)
    setCurrentDay(null)
    setCurrentTaskId(null)
  }

  return (
    <>
      <li className={`${dayInfo.inactive ? 'inactive' : ''} ${dayInfo.active ? 'active' : ''} day-cell`}
        draggable={true}
        onDragOver={(e) => dragOverHandler(e)}
        onDrop={(e) => dropHandler(e)}
      >
        <div className='day-header'>
          <div className='day-number'>{dayInfo.day}</div>
          <Holidays date={dayInfo.fullDate} />
          <img src="./plus-icon.png" alt="add item"  className='add-item-icon' onClick={(e) => {openModalHandler(e)}} />
        </div>
        {tasksList.find(task => task.date === dayInfo.fullDate)?.tasks
          .filter(task => searchByText 
            ? task.text.toLocaleLowerCase().includes(searchByText.toLocaleLowerCase()) 
            : true)
          .filter(task => searchByLabel 
            ? task.labels.includes(searchByLabel) 
            : true)
          .map((task) => 
            <div key={`${task.id}+${task.text}`}>
              <Task day={dayInfo} id={task.id} text={task.text} labels={task.labels}  />
            </div>
          )
        }
      </li>
      {openModal && <Modal setTaskText={setTaskText} setOpenModal={setOpenModal}/>}
    </>
  )
}

export default Day
