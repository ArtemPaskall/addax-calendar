import { useTasksContext } from '../../store'
import './ColorMenu.scss'

const ColorMenu = ({ labels }: {labels: string[]} ) => {
  const {colorArray} = useTasksContext()
  // const [color, setColor] = useState<string>("#000000");

  // const handleChange = (color: string) => {
  //   setColor(color)
  // };

  // const colorArray = ['red','yellow', 'blue', 'green', 'orange', 'black']

  return (
    <div className="color-menu">
      <button className='colorChange-button'></button>
      <ul className='drop-down-colors'>
        {colorArray.map((color, index) => 
          <li key={index} className='color-item' style={{backgroundColor: `${color}`}}></li>
        )}
      </ul>
    </div>
  )
}

export default ColorMenu