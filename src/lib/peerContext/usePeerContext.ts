import { useContext } from "react"
import { PeerContext } from "./peerContext"

export const usePeerContext = () => {

	const context = useContext(PeerContext)

	if (context === undefined ){
		throw new Error("usePeerContext must be used within a PeerContextProvider")
	}

	return context
}