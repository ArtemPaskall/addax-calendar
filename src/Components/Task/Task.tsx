import React, { useState } from 'react'
import { useTasksContext } from '../../store'
import './Task.scss'
import LabelMenu from '../LabelMenu/LebelMenu'
import { DayInfo } from '../../types'

const Task = ({
  day,
  id,
  text,
  labels,
}: {
  day: DayInfo
  id: string
  text: string
  labels: string[]
}) => {
  const { tasksList, setTasksList, currentDay, setCurrentDay, currentTaskId, setCurrentTaskId } =
    useTasksContext()
  const [isEditing, setIsEditing] = useState<Boolean>(false)
  const [editedText, setEditedText] = useState<string>(text)

  const deleteTaskHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newTasksList = tasksList
      .map(task => {
        if (task.tasks.find(task => task.date === day.fullDate)) {
          return {
            date: task.date,
            tasks: task.tasks.filter(task => task.id !== id),
          }
        }
        return task
      })
      .filter(task => task.tasks.length !== 0)

    setTasksList(newTasksList)
  }

  const saveEditHandler = (
    e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    e.stopPropagation()
    const newTasksList = tasksList.map(task => {
      if (task.tasks.find(task => task.date === day.fullDate)) {
        return {
          date: task.date,
          tasks: task.tasks.map(task => {
            if (task.id === id) {
              return {
                id: task.id,
                date: task.date,
                text: editedText,
                labels: task.labels,
              }
            }
            return task
          }),
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

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const targetElement = e.currentTarget as HTMLDivElement
    if (targetElement.className === 'task') {
      targetElement.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)'
    }
  }

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const targetElement = e.currentTarget as HTMLDivElement
    targetElement.style.boxShadow = 'none'
  }

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    currentDay: DayInfo,
    currentTaskId: string,
  ) => {
    e.stopPropagation()
    setCurrentDay(currentDay)
    setCurrentTaskId(currentTaskId)
  }

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const targetElement = e.currentTarget as HTMLDivElement
    targetElement.style.boxShadow = 'none'
  }

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, day: DayInfo, id: string) => {
    e.stopPropagation()

    if (currentDay && currentTaskId) {
      if (currentDay === day) {
        const listOfTasksToUpdate = tasksList.find(task => task.date === currentDay.fullDate)?.tasks
        const listOfTasksToUpdateWithoutCurrent = listOfTasksToUpdate?.filter(
          task => task.id !== currentTaskId,
        )
        let destinationElementIndex = listOfTasksToUpdate?.findIndex(task => task.id === id)
        destinationElementIndex =
          destinationElementIndex && destinationElementIndex !== 0 ? ++destinationElementIndex : 1
        const tasksBeforeDrop = listOfTasksToUpdateWithoutCurrent?.slice(0, destinationElementIndex)
        const tasksAfterDrop = listOfTasksToUpdateWithoutCurrent?.slice(destinationElementIndex)
        const currentTaskToUpdate = listOfTasksToUpdate?.find(task => task.id === currentTaskId)

        const updatedTasks =
          tasksBeforeDrop && tasksAfterDrop && currentTaskToUpdate
            ? [...tasksBeforeDrop, currentTaskToUpdate, ...tasksAfterDrop]
            : listOfTasksToUpdate

        const updatedTasksList = tasksList.map(task => {
          if (task.date === currentDay.fullDate) {
            return {
              date: task.date,
              tasks: updatedTasks || [],
            }
          }
          return task
        })

        setTasksList(updatedTasksList)
        setCurrentDay(null)
        setCurrentTaskId(null)

        const targetElement = e.currentTarget as HTMLDivElement
        targetElement.style.boxShadow = 'none'
        return
      }
      const sourceTaskListIndex = tasksList.findIndex(task => task.date === currentDay.fullDate)
      const sourceTaskIndex = tasksList[sourceTaskListIndex].tasks.findIndex(
        task => task.id === currentTaskId,
      )

      const destinationTaskListIndex = tasksList.findIndex(task => task.date === day.fullDate)

      const updatedSourceTasks = [...tasksList[sourceTaskListIndex].tasks]
      const movedTask = updatedSourceTasks.splice(sourceTaskIndex, 1)[0]
      movedTask.date = day.fullDate

      const onDropElementIndex =
        tasksList[destinationTaskListIndex].tasks.findIndex(task => task.id === id) + 1
      const tasksBeforeDrop = tasksList[destinationTaskListIndex].tasks.slice(0, onDropElementIndex)
      const tasksAfterDrop = tasksList[destinationTaskListIndex].tasks.slice(onDropElementIndex)

      const updatedDestinationTasks = [
        ...tasksBeforeDrop,
        movedTask,
        ...tasksAfterDrop.map(task => ({ ...task })),
      ]

      const updatedTasksList = tasksList
        .map(task => {
          if (task.date === currentDay.fullDate) {
            return {
              date: task.date,
              tasks: updatedSourceTasks,
            }
          }
          if (task.date === day.fullDate) {
            return {
              date: task.date,
              tasks: updatedDestinationTasks,
            }
          }
          return task
        })
        .filter(task => task.tasks.length !== 0)

      setTasksList(updatedTasksList)
      setCurrentDay(null)
      setCurrentTaskId(null)
    }

    const targetElement = e.currentTarget as HTMLDivElement
    targetElement.style.boxShadow = 'none'
  }

  return (
    <div
      className="task"
      draggable={true}
      onDragOver={e => dragOverHandler(e)}
      onDragLeave={e => dragLeaveHandler(e)}
      onDragStart={e => dragStartHandler(e, day, id)}
      onDragEnd={e => dragEndHandler(e)}
      onDrop={e => dropHandler(e, day, id)}
    >
      <div className="labels-wrapper">
        {labels.map((label, index) => (
          <div key={index} className="label" style={{ backgroundColor: `${label}` }}></div>
        ))}
      </div>
      <div className="task-wrapper">
        {isEditing && isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={editedText}
            onChange={e => {
              setEditedText(e.target.value)
            }}
            onBlur={e => saveEditHandler(e)}
            onKeyDown={e => {
              if (e.key === 'Enter') saveEditHandler(e)
            }}
          />
        ) : (
          <div className="task-text" onClick={editTextHandler}>
            {text}
          </div>
        )}
        <div className="edit-panel">
          <LabelMenu labels={labels} day={day} id={id} />
          <img
            src="./edit_pen_icon.png"
            alt="edit task"
            className="edit-task"
            onClick={editTextHandler}
          />
          <img
            src="./close-icon.png"
            alt="delete task"
            className="delete-task"
            onClick={deleteTaskHandler}
          />
        </div>
      </div>
    </div>
  )
}

export default Task
