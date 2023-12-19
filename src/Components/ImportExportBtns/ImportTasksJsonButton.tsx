import { useTasksContext } from '../../store'

const ImportTasksJsonButton = () => {
  const { setTasksList } = useTasksContext()

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        const result = event.target?.result as string
        if (result) {
          try {
            const importedTasks = JSON.parse(result)
            setTasksList(importedTasks)
            e.target.value = ''
          } catch (error) {
            console.error('Error parsing JSON file', error)
          }
        } else {
          console.error('File content is null or undefined.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleImport = () => {
    const inputElement = document.getElementById('fileInput')
    if (inputElement) {
      inputElement.click()
    }
  }

  return (
    <>
      <button onClick={handleImport}>Import Tasks</button>
      <input
        type="file"
        accept=".json"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </>
  )
}

export default ImportTasksJsonButton
