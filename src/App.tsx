import Calendar from './Components/Calendar/Calendar'
import { TasksProvider } from './store'
import './App.scss';

const App = () => {
  return (
    <>
      <TasksProvider>
        <Calendar />
      </TasksProvider>
    </>
  )}

export default App;