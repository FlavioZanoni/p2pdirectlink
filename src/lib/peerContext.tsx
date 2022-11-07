import React, { createContext, useEffect, useState } from "react"
import SimplePeer from "simple-peer"

export type PeerContextType = {
  peer?: SimplePeer.Instance
  initiator: boolean
  setInitiator: React.Dispatch<React.SetStateAction<boolean>>
}

export const PeerContext = createContext({} as PeerContextType)

type Props = {
  children: React.ReactNode
}

export const PeerProvider: React.FC<Props> = ({ children }) => {
	const [initiator, setInitiator] = useState(false)
	const [peer, setPeer] = useState<SimplePeer.Instance>()

	useEffect(() => {
		setPeer(new SimplePeer({ initiator }))
	}, [initiator])


	const values = {
		peer,
		initiator,
		setInitiator,
	}

	return <PeerContext.Provider value={values}>{children}</PeerContext.Provider>
}
