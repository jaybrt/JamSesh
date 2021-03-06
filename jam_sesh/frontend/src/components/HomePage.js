import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Rediredct} from 'react-router-dom'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Room from './Room'

const HomePage = () => {
  return(
    <Router>
      <Switch>
        <Route path='/' exact>
          <p>This is the home page</p>
        </Route>
        <Route path='/join' component={RoomJoinPage} />
        <Route path='/create' component={CreateRoomPage} />
        <Route path='/room/:roomCode' component = {Room} />
          </Switch>
    </Router>
  )
}

export default HomePage
