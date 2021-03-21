import React from 'react'
import { Link } from 'react-router-dom'
import { IconButton, Typography } from '@material-ui/core'

const TopBar = ({ Buttons, RoomCode }) => {

  return(
    <div className='topbar'>
      <Typography variant='h4' component='h4' style={{color: 'white'}}>{RoomCode}</Typography>

      {Buttons.map((button) => {
        return(
          <IconButton color='secondary' aria-label='room settings' onClick={button.onPress}>
            {button.Icon}
          </IconButton>
        )
      })}
    </div>
  )
}

export default TopBar
