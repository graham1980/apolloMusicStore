import React from 'react';
import { TextField,InputAdornment,Button, Dialog, DialogTitle, DialogContent,DialogActions, makeStyles } from '@material-ui/core';
import { Link,AddBoxOutlined } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import SoundcloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import { ADD_SONG } from '../graphql/mutations';
import { useMutation } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    urlInput: {
        margin: theme.spacing(1)
    },
    addSongButton: {
        margin: theme.spacing(1)
    },
    dialog: {
        textAlign: 'center'
    },
    thumbnail: {
        width: '90%'
    }
}))

const DEFAULT_SONG = {
    duration:0,
    title: "",
    artist: "",
    thumbnail: ""
}

function AddSong(){
    const classes = useStyles();
    const [addSong,{ error }] = useMutation(ADD_SONG);
    const [url, setUrl] = React.useState('')
    const [playable,setPlayable] = React.useState(false)
    const [dialog,setDialog]= React.useState(false);
    const [song,setSong] = React.useState(DEFAULT_SONG);
    React.useEffect(() => {
        //const isPlayable = SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
        setPlayable(true);
    },[url])

function handleChangeSong(event){
        const { name, value} = event.target;
        setSong(prevSong => ({
            ...prevSong,
            [name] : value
        }))
}

function handleCloseDialog(){
    setDialog(false);
}

    async function handleEditSong({ player }){
        const nesterPlayer = player.player.player;
        let songData;
        if(nesterPlayer.getVideoData) {
            songData = getYoutubeInfo(nesterPlayer);
        } else if(nesterPlayer.getCurrentSound){
            songData = await getSoundCloudInfo(nesterPlayer)
        }
        setSong({ ...songData,url})
    }

async function handleAddSong(){
    try {
        const { url, thumbnail, duration, title, artist } = song;

        await addSong({
            variables: {
                url: url.length > 0 ? url : null,
                thumbnail: thumbnail.length > 0 ? thumbnail : null,
                duration: duration > 0 ? duration : null,
                title : title.length > 0 ? title : null,
                artist : artist.length > 0 ? artist : null
            }
        })
        handleCloseDialog();
        setSong(DEFAULT_SONG);
        setUrl('');
    } catch(error) {
        console.log("Eror adding song", error);
    }
}

    function getSoundCloudInfo(player){
        return new Promise(resolve => {
            player.getCurrentSound(songData => {
                if(songData){
                    resolve({
                        duration: Number(songData.duration / 1000),
                        title: songData.title,
                        artist: songData.user.username,
                        thumbnail: songData.artwork_url.replace('-large','-t500x500')
                    })
                };
            })
        })
    }

    function getYoutubeInfo(player){
        const duration = 120
        const { title, video_id, author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
        return {
            duration,
            title,
            artist : author,
            thumbnail
        }
    }

    function handleError(field) {
        return error?.graphQLErrors[0]?.extensions?.path?.includes(field);
    }

    const { thumbnail,title,artist } = song;
    return (

        <div className={classes.container}>
            <Dialog
                className={classes.dialog}
                open={dialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Edit Song</DialogTitle>
                <DialogContent>
                    <img
                        src={thumbnail}
                        alt="Song thumbnail"
                        className={classes.thumbnail}
                    />
                
                <TextField
                 onChange={handleChangeSong}
                 value={title}
                 margin="dense"
                 name="title"
                 label="title"
                 fullWidth
                 error={handleError('title')}
                 helperText={handleError('title') && 'Fill out field'}
                />
                <TextField
                onChange={handleChangeSong}
                value={artist}
                margin="dense"
                name="artist"
                label="artist"
                fullWidth
                error={handleError('artist')}
                helperText={handleError('artist') && 'Fill out field'}
               />
               <TextField
                onChange={handleChangeSong}
                 value={thumbnail}
                 className={classes.thumbnail}
                 margin="dense"
                 name="thumbnail"
                 label="thumbnail"
                 fullWidth
                 error={handleError('thumbnail')}
                 helperText={handleError('thumbnail') && 'Fill out field'}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button 
                        onClick={handleAddSong}
                        variant="outlined" 
                        color="primary">Add Song</Button>
                </DialogActions>
            </Dialog>
            <TextField 
                className={classes.urlInput}
                onChange={event => setUrl(event.target.value)}
                value={url}
                placeholder="Add Youtube or Soundcloud URl"
                fullWidth
                margin="normal"
                type="url"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Link /> 
                        </InputAdornment>
                    )
                }}
            />
            <Button
                className={classes.addSongButton}
                disabled={!playable}
                onClick={()=> setDialog(true)}
                variant="contained"
                color="primary"
                endIcon={<AddBoxOutlined />}
            >
              Add
            </Button>  
            <ReactPlayer url={url} hidden onReady={handleEditSong} />
        </div>
    )
}

export default AddSong;