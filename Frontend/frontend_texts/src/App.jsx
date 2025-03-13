import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
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
