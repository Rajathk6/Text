import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';

function App() {
  function trigger() {
    toast.error('DO NOT CLICK', {duration: 2000});
  }
  return (
    <>
      <div>
        <h1>this is react page</h1>
        <button onClick={trigger}>click</button>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </div>
    </>
  )
}

export default App
