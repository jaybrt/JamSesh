import React from 'react'
import { Link } from 'react-router-dom'
import { IconButton, Typography } from '@material-ui/core'

const TopBar = ({ Icon, onPress, RoomCode }) => {

  return(
    <div className='topbar'>
      <Typography variant='h4' component='h4' style={{color: 'white'}}>{RoomCode}</Typography>
      <IconButton color='secondary' aria-label='room settings' onClick={onPress}>
        {Icon}
      </IconButton>
    </div>
  )
}

export default TopBar
