import React from "react";
import About from './pages/About'
import Receive from "./pages/Receive"
import Send from "./pages/Send"
import { Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'
import SocketContext, { socket } from "./lib/socket";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <main className="flex flex-row bg-[#525252]">
        <Navbar />
        <section className="flex grow ">
          <Routes>
            <Route path={'/'} element={<Send />} />
            <Route path={'/receive'} element={<Receive />} />
            <Route path={'/about'} element={<About />} />
          </Routes>
        </section>
      </main>
    </SocketContext.Provider>
  );
}

export default App
