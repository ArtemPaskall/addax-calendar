import  React, { ReactNode, createContext, useState, useContext } from 'react'
import { Taskslist, DayInfo, Holiday } from './types'
import initialTasks from './tasks.json'

interface TasksContextData {
  tasksList: Taskslist[]
  setTasksList: React.Dispatch<React.SetStateAction<Taskslist[]>>
  labelsArray: string[],
  currentDay: DayInfo | null,
  setCurrentDay: React.Dispatch<React.SetStateAction<DayInfo | null>>
  currentTaskId: string | null,
  setCurrentTaskId: React.Dispatch<React.SetStateAction<string | null>>,
  searchByText: string | null,
  setSearchByText: React.Dispatch<React.SetStateAction<string | null>>
  searchByLabel: string | null,
  setSearchByLabel: React.Dispatch<React.SetStateAction<string | null>>
  holidays: {[date: string]: Holiday[]},
  setHolidays: React.Dispatch<React.SetStateAction<{[date: string]: Holiday[]}>>,
}

const labelsArray = ['red','yellow', 'blue', 'green', 'orange', 'black']

export const TasksContex = createContext<TasksContextData>({} as TasksContextData)

const TasksProvider = ({ children } : { children: ReactNode }) => {
  const [tasksList, setTasksList] = useState<Taskslist[]>(initialTasks)
  const [currentDay, setCurrentDay] = useState<DayInfo | null>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [searchByText, setSearchByText] = useState<string | null>(null)
  const [searchByLabel, setSearchByLabel] = useState<string | null>(null)
  const [holidays, setHolidays] = useState<{[date: string]: Holiday[]}>({})
 
  return (
    <TasksContex.Provider 
      value={{
        tasksList, 
        setTasksList, 
        labelsArray, 
        currentDay, 
        setCurrentDay, 
        currentTaskId, 
        setCurrentTaskId,
        searchByText,
        setSearchByText,
        searchByLabel, 
        setSearchByLabel,
        holidays,
        setHolidays
      }}
    >
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