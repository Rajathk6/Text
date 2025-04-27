import toast, { Toaster } from 'react-hot-toast';
import LoginPage from './Component/LoginPage';

function App() {
  function trigger() {
    toast.error('DO NOT CLICK', {duration: 2000});
  }
  return (
    <>
      <LoginPage/>
    </>
  )
}

export default App
