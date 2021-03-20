import React from 'react'
import { Grid, Typography, Card, IconButton, LinearProgress, Button } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import { makeStyles } from '@material-ui/core/styles'

const skipStyles = makeStyles({
  root: {
    color: 'grey',
  },
  label: {
    flexDirection: 'column',
  }
})

const MediaPlayer = ({image_url, title, artist, is_playing, time, duration, votes, votes_required}) => {
  const songProgress = (time/duration) * 100

  const skipClasses = skipStyles()

  const sendPauseRequest = async () => {
    const requestOptions = {
      'method': 'PUT',
      'headers': {'Content-Type': 'application/json'},
    }
    const res = await fetch('/spotify/pause', requestOptions)
  }

  const sendPlayRequest = async () => {
    const requestOptions = {
      'method': 'PUT',
      'headers': {'Content-Type': 'application/json'},
    }
    const res = await fetch('/spotify/play', requestOptions)
  }

  const sendSkipRequest = async () =>{
    const requestOptions = {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
    }
    const res = await fetch('/spotify/skip', requestOptions)
  }

  return(
    <Card>
      <Grid container alignItems='center'>
        <Grid item align='center' xs={4}>
          <img src={image_url} height='100%' width='100%' />
        </Grid>
        <Grid item align='center' xs={8}>
          <Typography component='h5' variant='h5'>{title}</Typography>
          <Typography color='textSecondary' variant='subtitle1'>{artist}</Typography>
          <div>
            <IconButton onClick={is_playing ? sendPauseRequest : sendPlayRequest}>
              {is_playing ? <PauseIcon /> : <PlayArrowIcon /> }
            </IconButton>
            <Button classes={{label: skipClasses.label, root: skipClasses.root}}
              onClick={sendSkipRequest}>
              <SkipNextIcon />{votes} / {votes_required}
            </Button>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant='determinate' value={songProgress} />
    </Card>
  )
}

export default MediaPlayer
