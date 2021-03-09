import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText,
  FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { Collapse } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'


const CreateRoomPage = ({ update, votesToSkip, guestCanPause, roomCode, updateCallback}) => {
  const history = useHistory()

  const[guestCanPauseState, setGuestCanPauseState] = useState(guestCanPause)
  const[votesToSkipState, setVotesToSkipState] = useState(votesToSkip)
  const[successMsg, setSuccessMsg]  = useState('')
  const[errorMsg, setErrorMsg] = useState('')

  const handleVotesChange = (e) => {
    setVotesToSkipState(Number(e.target.value))
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPauseState(e.target.value === 'true' ? true : false)
  }

  const handleRoomButtonPressed = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
      }),
    }
    const res = await fetch('/api/create-room', requestOptions)
    const data = await res.json()
    history.push(`/room/${data.code}`)
  }

  const handleUpdateButtonPressed = async () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
        code: roomCode
      }),
    }
    const res = await fetch('/api/update-room', requestOptions)
    if(res.ok){
      setSuccessMsg('Room Updated Successfully!')
    }
    else{
      setErrorMsg('Error Updating Room')
    }
    updateCallback()
  }

  const renderCreateButtons = () => {
    return(
  <>
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
  </>)
  }

  const renderUpdateButton = () => {
    return(
      <>
        <Grid item xs={12} align="center">
          <Button color='primary'
            variant='contained'
            onClick={handleUpdateButtonPressed}>
            Update Room
          </Button>
        </Grid>
      </>
    )
  }

  const title = (update ? 'Update Room' : 'Create a Room')

  return(

    <div className='center'>
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Collapse in={errorMsg != '' || successMsg != ''}>
            {(successMsg != '')
              ? (<Alert severity='success' onClose={() => {setSuccessMsg('')}}>
                {successMsg}
              </Alert>)
              : (<Alert severity='error' onClose={() => {setErrorMsg('')}}>
                {errorMsg}
              </Alert>)
            }
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component='h4' variant='h4'>
            {title}
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <FormControl component='fieldset'>
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup row defaultValue={guestCanPause ? 'true' : 'false'} onChange={handleGuestCanPauseChange}>
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
              defaultValue={votesToSkipState}
              inputProps={{
                min:1,
                style:{textAlign: 'center'}
              }} />
            <FormHelperText>
              <div align='center'>Votes Required to Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {update ? renderUpdateButton() : renderCreateButtons()}
      </Grid>
    </div>

  )
}

export default CreateRoomPage

CreateRoomPage.defaultProps = {
  update: false,
  votesToSkip: 2,
  guestCanPause: true,
  roomCode: null,
  updateCallback: () => {},
}
