import { useEffect, useState } from 'react'
import { DayInfo, Holiday } from "../../types"


const Holidays = ({ dayInfo }: {dayInfo: DayInfo}) => {
  const [holidays, setHolidays] = useState<{[date: string]: Holiday[]}>({})

    useEffect(() => {
      async function fetchData() {
        const fetchCountries = await fetch('https://date.nager.at/api/v3/AvailableCountries')
        const countriesArray = await fetchCountries.json()
  
        const countriesArrayWithHolidaysPromises = countriesArray.map(async (country: any) => {
          const fetchHolidays2023 = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2023/${country.countryCode}`)
          const fetchHolidays2024 = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2024/${country.countryCode}`)
          const holidaysArray2023 = await fetchHolidays2023.json()
          const holidaysArray2024 = await fetchHolidays2024.json()
  
          const fetchHolidays = [...holidaysArray2023, ...holidaysArray2024]
  
          return {
            ...country,
            holidays: fetchHolidays
          }
        })
  
        const countriesArrayWithHolidays = await Promise.all(countriesArrayWithHolidaysPromises)
        const allHolidays: Holiday[] = countriesArrayWithHolidays.flatMap((country) => country.holidays)
  
        const holidaysByDate = allHolidays.reduce((acc: {[date: string]: Holiday[]}, holiday: Holiday) => {
          const date = holiday.date
          if (acc[date]) {
            acc[date].push(holiday)
          } else {
            acc[date] = [holiday]
          }
          return acc
        }, {})
  
        function filterUniqueNames(holidays: Holiday[]): Holiday[] {
          const uniqueNamesSet = new Set<string>()
          return holidays.filter((holiday) => {
            if (!uniqueNamesSet.has(holiday.name)) {
              uniqueNamesSet.add(holiday.name)
              return true
            }
            return false
          })
        }
        
        Object.keys(holidaysByDate).forEach((date) => {
          holidaysByDate[date] = filterUniqueNames(holidaysByDate[date])
        })
  
        function changeDateFormat(holidays: {[date: string]: Holiday[]}) {
          Object.keys(holidays).forEach(date => {
            const dateArray = date.split('-')
            const newDate = [dateArray[0], (+dateArray[1] - 1), +dateArray[2]].join('-')
            holidays[newDate] = holidays[date]
            delete holidays[date]
          })
        }
        
        changeDateFormat(holidaysByDate)
        setHolidays(holidaysByDate)
      }
  
      fetchData()
    } , [])
    
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