import SimplePeer from "simple-peer"

/**
 * @param {Boolean} initiator - is this the initiator peer ? true : false
 * @param {Boolean} trickle - has tricle capabilities ? true : false
 * @returns the peer instance
 */
function initializePeer(initiator, trickle) {
	const peer = new SimplePeer({
		initiator: initiator,
		trickle: trickle,
		stream: false,
	})

	return peer
}


export { initializePeer }

