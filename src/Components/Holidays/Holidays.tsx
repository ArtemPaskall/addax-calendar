import { useEffect, useState } from 'react'
import { useTasksContext } from '../../store'
import './Holidays.scss'

const Holidays = ({ date }: { date: string }) => {
  const { holidays } = useTasksContext()
  const [loading, setLoading] = useState<Boolean>(true)
  const [open, setOpen] = useState<Boolean>(false)

  const openCloseHandler = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (holidays) {
      setLoading(false)
    }
  }, [])

  return (
    <div className={`holiday-wrapper`}>
      {loading ? (
        <span className="loader"></span>
      ) : holidays[date] ? (
        <>
          <div onClick={openCloseHandler} className="holiday-title">
            Holidays
            <img
              src="arrow_botton.png"
              className={`drop-down-icon ${open ? 'drop-down-icon--open' : ''}`}
              alt="open close holidays"
            />
          </div>
          <div className={`holiday-content ${open ? 'holiday-content--open' : ''}`}>
            <div style={{ minHeight: '0px' }}>
              {holidays[date].map((holiday, index) => (
                <div key={index} className="holiday-name">
                  {holiday.name}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default Holidays
