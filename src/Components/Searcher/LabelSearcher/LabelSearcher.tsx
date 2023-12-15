import { useEffect, useState } from 'react'
import { useTasksContext } from '../../../store'

function LabelSearcher()  {
  const [inputLabel, setInputLabel] = useState<string | null>(null) 
  const {labelsArray, setSearchByLabel} = useTasksContext()

  const inputLabelHandler = (label: string | null) => {
    inputLabel === label ? setInputLabel(null) : setInputLabel(label)
  }

  useEffect(() => {
    setSearchByLabel(inputLabel)
  }, [inputLabel])

  return (
    <div className="color-menu">
      <button className='colorChange-button'></button>
      <ul className='drop-down-colors'>
        {labelsArray.map((label) => 
          <li 
            key={label} 
            className={`color-item ${inputLabel === label && 'color-item--active'}`} 
            style={{backgroundColor: `${label}`}}
            onClick={() => inputLabelHandler(label)}
          >
          </li>
        )}
      </ul>
    </div>
  )
}

export default LabelSearcher
