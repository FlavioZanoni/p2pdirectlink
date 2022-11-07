import React from "react"
import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { PeerProvider } from "./lib/peerContext/peerContext"
import { SocketProvider } from "./lib/socketContext/socketContext"
import About from "./pages/About"
import Receive from "./pages/Receive"
import Send from "./pages/Send"

function App() {
	return (
		<main className="flex flex-row bg-[#525252]">
			<Navbar />
			<section className="flex grow ">
				<PeerProvider>
					<SocketProvider>
						<Routes>
							<Route path={"/"} element={<Send />} />
							<Route path={"/receive"} element={<Receive />} />
							<Route path={"/about"} element={<About />} />
						</Routes>
					</SocketProvider>
				</PeerProvider>
			</section>
		</main>
	)
}
export default App