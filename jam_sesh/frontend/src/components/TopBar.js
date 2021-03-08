import React from 'react'
import { Link } from 'react-router-dom'
import { IconButton } from '@material-ui/core'

const TopBar = ({ Icon, onPress }) => {

  return(
    <div className='topbar'>
      <IconButton color='secondary' aria-label='room settings' onClick={onPress}>
        {Icon}
      </IconButton>
    </div>
  )
}

export default TopBar
