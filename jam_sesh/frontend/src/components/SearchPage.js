import React, { useState } from 'react'
import { Grid, TextField, IconButton, Typography, Card } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'

const SearchPage = () => {
  const [searchKwargs, setSearchKwargs] = useState('')
  const [songs, setSongs] = useState([])

  const handleInputChange = (e) => {
    setSearchKwargs(e.target.value)
  }

  const searchSong = async () => {
    const res = await fetch(`/spotify/search?q=${searchKwargs}`)
    const data = await res.json()
    setSongs(data.songs)
  }

  return(
    <div className='center'>
      <Grid container spacing={1} align='center'>
        <Grid item xs={12} align='center'>
          <Typography variant='h4' component='h4'>
            Add a Song to The Queue
          </Typography>
        </Grid>
        <Grid item align='center' xs={12}>
          <TextField error=''
            placeholder='Search For a Song'
            value={searchKwargs}
            variant='outlined'
            onChange={handleInputChange}
          />
          <IconButton aria-label='search' onClick={searchSong}>
            <SearchIcon />
          </IconButton>
        </Grid>
        {songs.map((song) => {
          return(
            <Grid item xs={12}>
              <Card>
                <Grid container alignItems='center'>
                  <Grid item xs={2} align='left'>
                    <img src={song.image_url}></img>
                  </Grid>
                  <Grid item xs={8} align='center'>
                    <Typography variant='subtitle1'>
                      {song.name.length <= 40 ? song.name : song.name.slice(0,37).concat('...')}
                    </Typography>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {song.artist}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )
        })}
      </Grid>

    </div>
  )
}

export default SearchPage
