import { Toaster } from 'react-hot-toast';
import TaskListPage from './pages/TaskListPage';

function App() {
  return (
    <>
      <TaskListPage />

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;