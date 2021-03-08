import React, { useState } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const Room = ({ match, leaveRoomCallback }) => {
  const history = useHistory()

  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const getRoomDetails = async () => {
    const res = await fetch(`/api/get-room?code=${roomCode}`)
    if(res.ok){
      const data = await res.json()

      setVotesToSkip(data.votes_to_skip)
      setGuestCanPause(data.guest_can_pause)
      setIsHost(data.is_host)
    }
    else{
      leaveRoomCallback()
      history.push('/')
    }

  }

  const leaveRoom = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
    }

    const res = await fetch('/api/leave-room', requestOptions)
    leaveRoomCallback()
    history.push('/')
  }

  const roomCode = match.params.roomCode
  getRoomDetails()


  return(
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Votes to Skip: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Guests Can Pause: {String(guestCanPause)}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Host: {String(isHost)}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color='secondary'
          variant='contained'
          onClick={leaveRoom}>
          Leave Room
        </Button>
      </Grid>
    </Grid>

  )
}

export default Room
