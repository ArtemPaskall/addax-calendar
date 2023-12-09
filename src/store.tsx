import  React, { ReactNode, createContext, useState, useContext } from 'react';
import { Taskslist } from './types'

interface TasksContextData {
  tasksList: Taskslist[]
  setTasksList: React.Dispatch<React.SetStateAction<Taskslist[]>>
  labelsArray: string[]
}

const labelsArray = ['red','yellow', 'blue', 'green', 'orange', 'black']

export const TasksContex = createContext<TasksContextData>({} as TasksContextData);

const TasksProvider = ({ children } : { children: ReactNode }) => {
  const [tasksList, setTasksList] = useState<Taskslist[]>([])

  return (
    <TasksContex.Provider value={{tasksList, setTasksList, labelsArray}}>
      {children}
    </TasksContex.Provider>
  )
}

const useTasksContext = (): TasksContextData  => {  
  const context = useContext(TasksContex as React.Context<TasksContextData>);

  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }

  return context;
}

export { TasksProvider, useTasksContext };