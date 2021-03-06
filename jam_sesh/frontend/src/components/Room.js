import React, { useState } from 'react'

const Room = ({ match }) => {

  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const getRoomDetails = async () => {
    const res = await fetch(`/api/get-room?code=${roomCode}`)
    const data = await res.json()

    setVotesToSkip(data.votes_to_skip)
    setGuestCanPause(data.guest_can_pause)
    setIsHost(data.is_host)
  }

  const roomCode = match.params.roomCode
  getRoomDetails()


  return(
    <div>
      <h3>{roomCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>GuestCanPause: {String(guestCanPause)}</p>
      <p>Host: {String(isHost)}</p>
    </div>
  )
}

export default Room
