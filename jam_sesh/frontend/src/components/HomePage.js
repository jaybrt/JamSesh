import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom'
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Room from './Room'

const HomePage = () => {

  const [roomCode, setRoomCode] = useState(null)

  useEffect(() => {
    const toExistingRoom = async () => {
      const res = await fetch('/api/user-in-room')
      const data = await res.json()

      setRoomCode(data.code)
    }

    toExistingRoom()
  }, [])

  const renderHomePage = () => {
    return(
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} align='center'>
          <Typography variant='h3' component='h3'>Jam-Sesh</Typography>
        </Grid>
        <Grid item align='center'>
          <Button color='primary' variant='contained' to='/join' component={Link}>
            Join a Room
          </Button>
        </Grid>
        <Grid item align='center'>
          <Button color='secondary' variant='contained' to='/create' component={Link}>
            Create a Room
          </Button>
        </Grid>
      </Grid>
    )
}

  return(
    <Router>
      <Switch>
        <Route path='/' exact render={() => {
          return roomCode ? (<Redirect to={`/room/${roomCode}`} />) : (renderHomePage())
            }}/>
        <Route path='/join' component={RoomJoinPage} />
        <Route path='/create' component={CreateRoomPage} />
        <Route path='/room/:roomCode' component = {Room} />
      </Switch>
    </Router>
  )
}

export default HomePage
