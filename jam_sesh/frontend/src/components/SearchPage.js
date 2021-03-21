import React, { useState } from 'react'
import { Grid, TextField, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const SearchPage = () => {
  const [searchKwargs, setSearchKwargs] = useState('')

  const handleInputChange = (e) => {
    setSearchKwargs(e.target.value)
  }

  return(
    <div className='center'>
      <Grid container spacing={1}>
        <Grid item align='center'>
          <TextField error=''
            placeholder='Search For a Song'
            value={searchKwargs}
            variant='outlined'
            onChange={handleInputChange}
          />
          <IconButton aria-label='search'>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>

    </div>
  )
}

export default SearchPage
