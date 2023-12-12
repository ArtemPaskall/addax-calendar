import  React, { ReactNode, createContext, useState, useContext } from 'react'
import { Taskslist, DayInfo } from './types'

interface TasksContextData {
  tasksList: Taskslist[]
  setTasksList: React.Dispatch<React.SetStateAction<Taskslist[]>>
  labelsArray: string[],
  currentDay: DayInfo | null,
  setCurrentDay: React.Dispatch<React.SetStateAction<DayInfo | null>>
  currentTask: string | null,
  setCurrentTask: React.Dispatch<React.SetStateAction<string | null>>
}

const labelsArray = ['red','yellow', 'blue', 'green', 'orange', 'black']

export const TasksContex = createContext<TasksContextData>({} as TasksContextData);

const TasksProvider = ({ children } : { children: ReactNode }) => {
  const [tasksList, setTasksList] = useState<Taskslist[]>([])
  const [currentDay, setCurrentDay] = useState<DayInfo | null>(null)
  const [currentTask, setCurrentTask] = useState<string | null>(null)

  return (
    <TasksContex.Provider value={{tasksList, setTasksList, labelsArray, currentDay, setCurrentDay, currentTask, setCurrentTask}}>
      {children}
    </TasksContex.Provider>
  )
}

const useTasksContext = (): TasksContextData  => {  
  const context = useContext(TasksContex as React.Context<TasksContextData>)

  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider")
  }

  return context
}

export { TasksProvider, useTasksContext }