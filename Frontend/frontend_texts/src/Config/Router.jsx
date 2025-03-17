import React from "react";
import { Route, Routes } from "react-router";
import App from "../App";
import Dashboard from "../Component/Dashboard";

function Router() {
    return (
    <Routes>
      <Route path="/login" element={<App />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="*" element={<h2>404: This page doesnot exist</ h2>} />
    </Routes>
    )
}

export default Router