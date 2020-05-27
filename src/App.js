import React from 'react';
import Header from './components/Header';
import AddSong from './components/AddSong';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import {Grid, useMediaQuery} from '@material-ui/core';
import songReducer from './reducer';

export const SongContext = React.createContext({
  song: {
    id: "fce197fc-b208-42bf-8935-51dee93f673a",
    title: "Electronic Music for Studying, Concentration and Focus | Chill House Electronic Study Music Mix",
    artist: "Various",
    thumbnail: "https://img.youtube.com/vi/ypQZV03l80g/0.jpg",
    url: "https://www.youtube.com/watch?v=ypQZV03l80g",
    duration: 5412
  },
  isPlaying:false
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState)
  const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
      <SongContext.Provider value={{ state, dispatch }}>
        {greaterThanMd && <Header/>}
        <Grid container spacing={3}>
          <Grid style={{
            addingTop: greaterThanSm ? 80 : 10
          }} item xs={12} md={7}>
            <AddSong/>
            <SongList/>
          </Grid>
          <Grid style={
           greaterThanMd ? { 
            position: 'fixed',
            width: '100%',
            right: 0,
            top: 70
          } : {
            position: 'fixed',
            width: '100%',
            left: 0,
            bottom: 0
          }} 
          item xs={12} md={5}>
            <SongPlayer/>
          </Grid>
        </Grid>
      </SongContext.Provider>
  );
}

export default App;
