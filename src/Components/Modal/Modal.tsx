import { ReactNode, useState } from 'react'
import './Modal.scss'

interface ModalProps {
  children?: ReactNode
  setTaskText: React.Dispatch<React.SetStateAction<string>>
  setOpenModal: React.Dispatch<React.SetStateAction<Boolean>>
}

const Modal: React.FC<ModalProps> = ({ children, setTaskText, setOpenModal}) => {
  const [inputText, setInputText] = useState<string>('')

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setTaskText((e.target as HTMLInputElement).value)
      setOpenModal(false)
    }
  }

  const handleBlur = () => {
    setTaskText(inputText)
    setOpenModal(false)
  }

  return (  
    <div className="modal modal--active">
      <div className="modal__content">
        <input 
          type="text" 
          className='modal__input' 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  )
}

export default Modal