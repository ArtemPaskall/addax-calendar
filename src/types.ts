export interface DayInfo {
  day: number
  active?: boolean
  inactive?: boolean
  fullDate: string
}

export interface Country {
  countryCode: string
  name: string
  holidays: Holiday[]
}

export interface Holiday {
  date: string
  name: string
}

export interface Taskslist {
  date: string
  tasks: Task[]
}

export interface Task {
  id: string
  date: string
  text: string
  labels: string[]
}
