import React, { createContext, useEffect, useState } from "react"
import SimplePeer from "simple-peer"
import { PeerDataType } from "../sharedTypes"

export type PeerContextType = {
  peer?: SimplePeer.Instance,
  peerData?: PeerDataType,
  initiator: boolean
  setInitiator: React.Dispatch<React.SetStateAction<boolean>>
}

export const PeerContext = createContext({} as PeerContextType)

type Props = {
  children: React.ReactNode
}

export const PeerProvider: React.FC<Props> = ({ children }) => {
	const [initiator, setInitiator] = useState(true)
	const [peer, setPeer] = useState<SimplePeer.Instance>()
	const [peerData, setPeerData] = useState<PeerDataType>()

	useEffect(() => {
		setPeer(new SimplePeer({ initiator: initiator, trickle:false }))
	}, [initiator])

	useEffect(() => {
		if (!peer) return
		initiator && (
			peer.on("signal", (data: PeerDataType) => {
				setPeerData(data)
			})
		)
	}, [peer])

	const values = {
		peer,
		peerData,
		initiator,
		setInitiator,
	}
	return <PeerContext.Provider value={values}>{children}</PeerContext.Provider>
}
