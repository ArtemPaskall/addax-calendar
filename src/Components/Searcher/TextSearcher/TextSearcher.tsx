import { useEffect, useState } from 'react'
import { useTasksContext } from '../../../store'
import './TextSearcher.scss'

function TextSearcher() {
  const [inputText, setInputText] = useState<string>('')
  const { setSearchByText } = useTasksContext()

  useEffect(() => {
    setSearchByText(inputText)
  }, [inputText])

  return (
    <>
      <input
        type="text"
        className="text-searcher"
        placeholder="Search by text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
    </>
  )
}

export default TextSearcher
