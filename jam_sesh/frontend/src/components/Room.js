import React, { useState } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings'
import CloseIcon from '@material-ui/icons/Close';
import TopBar from './TopBar'
import CreateRoomPage from './CreateRoomPage'

const Room = ({ match, leaveRoomCallback }) => {
  const history = useHistory()

  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [settingsView, setSettingsView] = useState(false)
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)

  const getRoomDetails = async () => {
    const res = await fetch(`/api/get-room?code=${roomCode}`)
    if(res.ok){
      const data = await res.json()

      setVotesToSkip(data.votes_to_skip)
      setGuestCanPause(data.guest_can_pause)
      setIsHost(data.is_host)
      isHost && authenticateSpotify()
    }
    else{
      leaveRoomCallback()
      history.push('/')
    }

  }

  const authenticateSpotify = async () => {
    const res = await fetch('/spotify/is-authenticated')
    const data = await res.json()
    setSpotifyAuthenticated(data.Status)
    if(!data.Status){
      const urlRes = await fetch('/spotify/get-auth-url')
      const urlData = await urlRes.json()
      window.location.replace(urlData.url)
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

  const renderSettings = () => {
    return(
      <Grid container spacing={1}>
        <Grid item align='center'>
          <CreateRoomPage update={true}
            votesToSkip={votesToSkip}
            roomCode={roomCode}
            guestCanPause={guestCanPause}
            updateCallback={() =>{getRoomDetails}}
          />
        </Grid>
      </Grid>
    )
  }

  const rendersSettingsButton = () => {
    return(
      <TopBar
        Icon={settingsView ? <CloseIcon fontSize='large'/> : <SettingsIcon  fontSize='large'/>}
        onPress={() => {setSettingsView(!settingsView)}}
        RoomCode={roomCode}/>
    )
  }

  const renderRoom = () => {
    return(
      <div className='center'>
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
      </div>
    )
  }

  const roomCode = match.params.roomCode
  getRoomDetails()


  return(
    <>
      {isHost && rendersSettingsButton()}
      {settingsView ? renderSettings() : renderRoom()}
    </>


  )
}

export default Room
