import React, { useState } from 'react'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'

const JoinRoomPage = () => {
  const history = useHistory()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value)
  }
  const handleRoomButtonPressed = async () => {
    const requestOptoins = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({code: roomCode})
    }

    const res = await fetch('/api/join-room', requestOptoins)

    res.ok ? history.push(`/room/${roomCode}`) : setError('Room not found.')
  }

  return(
    <div className='center'>
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Typography variant='h4' component='h4'>Join a Room</Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <TextField error={error}
            label='Code'
            placeholder='Enter a Room Code'
            value={roomCode}
            helperText={error}
            variant='outlined'
            onChange={handleTextFieldChange}
            inputProps={{ maxLength: 6}}/>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant='contained' color='primary' onClick={handleRoomButtonPressed}>Enter Room</Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant='contained' color='secondary' to='/' component={Link}>Back</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default JoinRoomPage
