import React from "react";
import About from './pages/About'
import Receive from "./pages/Receive"
import Send from "./pages/Send"
import { Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="flex flex-row">
      <Navbar />
      <main>
        <Routes>
          <Route path={'/'} element={<Send />} />
          <Route path={'/receive'} element={<Receive />} />
          <Route path={'/about'} element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
