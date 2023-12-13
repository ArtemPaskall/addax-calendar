import { useState, useEffect } from 'react'
import './Calendar.scss'
import  Day from '../Day/Day'
import { DayInfo } from '../../types'
import html2canvas from 'html2canvas'
import { useTasksContext } from '../../store'
import { Taskslist } from '../../types'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currYear, setCurrYear] = useState<number>(currentDate.getFullYear())
  const [currMonth, setCurrMonth] = useState<number>(currentDate.getMonth())
  const [days, setDays] = useState<DayInfo[]>([])
  const {tasksList, setTasksList} = useTasksContext()

  const months: string[] = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ]

  const renderCalendar = () => {
    const firstDayofMonth: number = new Date(currYear, currMonth, 1).getDay()
    const lastDateofMonth: number = new Date(currYear, currMonth + 1, 0).getDate()
    const lastDayofMonth: number = new Date(currYear, currMonth, lastDateofMonth).getDay()
    const lastDateofLastMonth: number = new Date(currYear, currMonth, 0).getDate()

    let daysArray: DayInfo[] = []

    for (let i = firstDayofMonth; i > 0; i--) {
      daysArray.push({ day: lastDateofLastMonth - i + 1, inactive: true, fullDate: getDateForNonActiveMonth(lastDateofLastMonth - i + 1, 'prev') })
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const isToday: boolean = i === currentDate.getDate() && currMonth === currentDate.getMonth() && currYear === currentDate.getFullYear();
      daysArray.push({ day: i, active: isToday, fullDate: `${currYear}-${currMonth}-${i}`})
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      daysArray.push({ day: i - lastDayofMonth + 1, inactive: true,  fullDate: getDateForNonActiveMonth(i - lastDayofMonth + 1, 'next') })
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
  }

  const getDateForNonActiveMonth = (day: number, monthOrder: ('prev' | 'next')) => {
    if (monthOrder === 'next') {
      if (currMonth === 11) return `${currYear + 1}-${currMonth - 11}-${day}`
      return `${currYear}-${currMonth + 1}-${day}`
    } 

    if (monthOrder === 'prev') {
      if (currMonth === 0) return `${currYear - 1}-${currMonth + 11}-${day}`
      return `${currYear}-${currMonth -1}-${day}`
    } 

    throw new Error('getDateForNonActiveMonth: Unexpected condition, unable to determine fullDate.');
  }

  const downloadCalendarImage = () => {
    const calendarElement = document.getElementById('wrapper')
      if (!calendarElement) return
  
    html2canvas(calendarElement).then((canvas) => {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/jpeg')
      link.download = 'calendar.jpeg'
      link.click()
    })
  }

  const exportTasks = (tasks: Taskslist[]) => {
    const jsonData = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

    const handleExport = () => {
      exportTasks(tasksList);
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            try {
              const importedTasks = JSON.parse(result);
              setTasksList(importedTasks);
            } catch (error) {
              console.error('Error parsing JSON file', error);
            }
          } else {
            console.error('File content is null or undefined.');
          }
        };
        reader.readAsText(file);
      }
    };

    const handleImport = () => {
      const inputElement = document.getElementById('fileInput');
      if (inputElement) {
        inputElement.click();
      }
    };

  console.log('tasksList', tasksList)

  return (
    <div className="wrapper" id='wrapper'>
      <header>
        <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
        <button onClick={downloadCalendarImage}>Download Calendar</button>
        <button onClick={handleExport}>Export Tasks</button>
        <button onClick={handleImport}>Import Tasks</button>
        <input
          type="file"
          accept=".json"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
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
          {days.map((dayInfo, index) =>  (
            <Day key={index} dayInfo={dayInfo} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar