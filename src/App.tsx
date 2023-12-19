import { useEffect } from 'react'
import { Holiday } from './types'
import { useTasksContext } from './store'
import Calendar from './Components/Calendar/Calendar'
import './App.scss'

const App = () => {
  const { setHolidays } = useTasksContext()

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchCountries = await fetch('https://date.nager.at/api/v3/AvailableCountries')
        if (!fetchCountries.ok) {
          throw new Error('Countries fetch failed')
        }
        const countriesArray = await fetchCountries.json()

        const countriesArrayWithHolidaysPromises = countriesArray.map(async (country: any) => {
          const fetchHolidays2023 = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/2023/${country.countryCode}`,
          )
          const fetchHolidays2024 = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/2024/${country.countryCode}`,
          )
          if (!fetchHolidays2023.ok || !fetchHolidays2024.ok) {
            throw new Error('Holidays fetch failed')
          }
          const holidaysArray2023 = await fetchHolidays2023.json()
          const holidaysArray2024 = await fetchHolidays2024.json()

          const fetchHolidays = [...holidaysArray2023, ...holidaysArray2024]

          return {
            ...country,
            holidays: fetchHolidays,
          }
        })

        const countriesArrayWithHolidays = await Promise.all(countriesArrayWithHolidaysPromises)
        const allHolidays: Holiday[] = countriesArrayWithHolidays.flatMap(
          country => country.holidays,
        )

        const holidaysByDate = allHolidays.reduce(
          (acc: { [date: string]: Holiday[] }, holiday: Holiday) => {
            const date = holiday.date
            if (acc[date]) {
              acc[date].push(holiday)
            } else {
              acc[date] = [holiday]
            }
            return acc
          },
          {},
        )

        function filterUniqueNames(holidays: Holiday[]): Holiday[] {
          const uniqueNamesSet = new Set<string>()
          return holidays.filter(holiday => {
            if (!uniqueNamesSet.has(holiday.name)) {
              uniqueNamesSet.add(holiday.name)
              return true
            }
            return false
          })
        }

        Object.keys(holidaysByDate).forEach(date => {
          holidaysByDate[date] = filterUniqueNames(holidaysByDate[date])
        })

        function changeDateFormat(holidays: { [date: string]: Holiday[] }) {
          Object.keys(holidays).forEach(date => {
            const dateArray = date.split('-')
            const newDate = [dateArray[0], +dateArray[1] - 1, +dateArray[2]].join('-')
            holidays[newDate] = holidays[date]
            delete holidays[date]
          })
        }

        changeDateFormat(holidaysByDate)
        setHolidays(holidaysByDate)
      } catch (error: any) {
        console.log(error.message)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Calendar />
    </>
  )
}

export default App
