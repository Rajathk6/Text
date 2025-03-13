import React from "react";
import { Route, Routes } from "react-router";
import App from "../App";

function Router() {
    return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="home" element={<h1>this is home page</ h1>} />
      <Route path="*" element={<h2>404: This page doesnot exist</ h2>} />
    </Routes>
    )
}

export default Router