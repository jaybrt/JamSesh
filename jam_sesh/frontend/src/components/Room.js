import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import SettingsIcon from '@material-ui/icons/Settings'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import TopBar from './TopBar'
import CreateRoomPage from './CreateRoomPage'
import MediaPlayer from './MediaPlayer'
import SearchPage from './SearchPage'

const Room = ({ match, leaveRoomCallback }) => {
  const history = useHistory()

  const pages = {
    MAIN: 'pages.main',
    SETTINGS: 'pages.settings',
    SEARCH: 'pages.search',
  }

  const settingsButton = {
    Icon: <SettingsIcon  fontSize='large'/>,
    onPress: ()=>{setPage(pages.SETTINGS)},
  }

  const searchButton = {
    Icon: <AddIcon fontSize='large' />,
    onPress: ()=>{setPage(pages.SEARCH)},
  }

  const closeButton = {
    Icon: <CloseIcon fontSize='large'/>,
    onPress: ()=>{setPage(pages.MAIN)},
  }

  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [page, setPage] = useState(pages.MAIN)
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
  const [song, setSong] = useState({})

  useEffect(() => {
    let interval = setInterval(getCurrentSong, 1000);
    return(() => clearInterval(interval))
  }, [])

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

  const getCurrentSong = async () => {
    try{
      const res = await fetch('/spotify/current-song')
      if(!res.ok){
        return({})
      }
      else{
        const data = await res.json()
        setSong(data)
      }
    }
    catch (err){
    //pass
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

  const renderSearch = () => {
    return(
      <Grid container spacing={1}>
        <Grid item align='center'>
          <SearchPage />
        </Grid>
      </Grid>
    )
  }

  const renderButtons = () => {
    let buttons = []
    if(page !== pages.MAIN){
      buttons = [closeButton]
    }else{
      if(isHost){
        buttons = [settingsButton, searchButton]
      }else{
        buttons = [searchButton]
      }
    }

    return(
      <TopBar
        Buttons={buttons}
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
          <MediaPlayer {...song}/>
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

  const renderPage = () => {
    let ret = ''
    if(page === pages.SETTINGS){
      ret = renderSettings()
    }else if(page === pages.SEARCH){
      ret = renderSearch()
    }else{
      ret = renderRoom()
    }
    return ret
  }

  const roomCode = match.params.roomCode
  getRoomDetails()


  return(
    <>
      {renderButtons()}
      {renderPage()}
    </>


  )
}

export default Room
