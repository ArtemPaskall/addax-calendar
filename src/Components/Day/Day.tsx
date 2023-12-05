import { DayInfo } from "../../types" 

export function Day({ dayInfo }: {dayInfo: DayInfo}) {
  return (
    <>
      <li className={`${dayInfo.inactive ? 'inactive' : ''} ${dayInfo.active ? 'active' : ''}`}>
        {dayInfo.day}
      </li>
    </>
  )
}