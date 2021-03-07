import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText,
  FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'


const CreateRoomPage = () => {
  const defaultVotes = 2
  const history = useHistory()

  const[guestCanPause, setGuestCanPause] = useState(true)

  const[votesToSkip, setVotesToSkip] = useState(defaultVotes)

  const handleVotesChange = (e) => {
    setVotesToSkip(Number(e.target.value))
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false)
  }

  const handleRoomButtonPressed = async () => {
    const requestOptoins = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    }
    const res = await fetch('/api/create-room', requestOptoins)
    const data = await res.json()
    history.push(`/room/${data.code}`)
  }

  return(
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component='h4' variant='h4'>
          Create a Room
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <FormControl component='fieldset'>
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup row defaultValue='true' onChange={handleGuestCanPauseChange}>
            <FormControlLabel value='true'
              control={<Radio color='primary' />}
              label='Play/Pause'
              labelPlacement='bottom'
            />
            <FormControlLabel value='false'
              control={<Radio color='secondary' />}
              label='No Control'
              labelPlacement='bottom'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type='number'
            onChange={handleVotesChange}
            defaultValue={defaultVotes}
            inputProps={{
              min:1,
              style:{textAlign: 'center'}
            }} />
          <FormHelperText>
            <div align='center'>Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color='primary'
          variant='contained'
          onClick={handleRoomButtonPressed}>
          Create a Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color='secondary'
          variant='contained'
          to='/' component={Link}>
          Back
        </Button>
      </Grid>

    </Grid>
  )
}

export default CreateRoomPage
