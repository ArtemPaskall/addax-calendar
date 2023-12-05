import React, { useState, useEffect } from 'react'
import './App.scss'
import { Day } from './Components/Day/Day'
import { DayInfo } from './types'

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currYear, setCurrYear] = useState<number>(currentDate.getFullYear())
  const [currMonth, setCurrMonth] = useState<number>(currentDate.getMonth())
  const [days, setDays] = useState<DayInfo[]>([]);

  const months: string[] = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const renderCalendar = () => {
    const firstDayofMonth: number = new Date(currYear, currMonth, 1).getDay()
    const lastDateofMonth: number = new Date(currYear, currMonth + 1, 0).getDate()
    const lastDayofMonth: number = new Date(currYear, currMonth, lastDateofMonth).getDay()
    const lastDateofLastMonth: number = new Date(currYear, currMonth, 0).getDate()

    let daysArray: DayInfo[] = []

    for (let i = firstDayofMonth; i > 0; i--) {
      daysArray.push({ day: lastDateofLastMonth - i + 1, inactive: true })
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const isToday: boolean = i === currentDate.getDate() && currMonth === currentDate.getMonth() && currYear === currentDate.getFullYear();
      daysArray.push({ day: i, active: isToday })
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      daysArray.push({ day: i - lastDayofMonth + 1, inactive: true })
    }

    setDays(daysArray);
  };

  useEffect(() => {
    renderCalendar()
  }, [currYear, currMonth])

  const handlePrevNext = (direction: 'prev' | 'next') => {
    let newMonth = direction === 'prev' ? currMonth - 1 : currMonth + 1
    let newYear = currYear
  
    if (newMonth < 0) {
      newMonth = 11
      newYear = currYear - 1
    } else if (newMonth > 11) {
      newMonth = 0
      newYear = currYear + 1
    }
  
    setCurrMonth(newMonth)
    setCurrYear(newYear)
  };

  return (
    <div className="wrapper">
      <header>
        <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
        <div className="icons">
          <span onClick={() => handlePrevNext('prev')}>{'<'}</span>
          <span onClick={() => handlePrevNext('next')}>{'>'}</span>
        </div>
      </header>
      <div className="calendar">
        <ul className="weeks">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days">
          {days.map((dayInfo, index) => (
            <Day key={index} dayInfo={dayInfo}/>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

