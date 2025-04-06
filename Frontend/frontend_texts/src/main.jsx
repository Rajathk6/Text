import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router"
import Router from './Config/Router.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
        <Router/>
    </BrowserRouter>
  
)
