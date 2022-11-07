import { useContext } from "react"
import { SocketContext } from "./socketContext"

export const useSocketContext = () => {
	const context = useContext(SocketContext)

	if (context === undefined) {
		throw new Error("usePeerContext must be used within a PeerContextProvider")
	}

	return context
}
