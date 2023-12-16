import { useEffect, useState } from 'react'
import { DayInfo, Holiday } from "../../types"


const Holidays = ({ dayInfo }: {dayInfo: DayInfo}) => {
  const [holidays, setHolidays] = useState<{[date: string]: Holiday[]}>({})


    
    return (
      <div className='holiday-wrapper'>
      {holidays[dayInfo.fullDate] 
        ? <>{holidays[dayInfo.fullDate].map((h, index) =>
          <div className={`holiday-content ${index === 0 && 'holiday-content--first'}`}>{h.name}</div> 
          )}</>
        : <>Loading</>}
      </div>
    )
}


export default Holidays