import { useEffect, useState } from 'react'
import { useTasksContext } from '../../../store'

function TextSearcher()  {
  const [inputText, setInputText] = useState<string>('') 
  const {setSearchByText} = useTasksContext()

  useEffect(() => {
    setSearchByText(inputText)
  }, [inputText])

  return (
    <>
      <input
        type="text"
        placeholder="Search by text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
    </>
  )
}

export default TextSearcher
