import React from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify'
import millistoMinutesandSeconds from "../lib/time"
import { currentTrackIdState , isPlayingState } from "../atoms/songAtom"
// import spotipy from 'spotipy';
// import SpotifyOAuth from 'spotipy.oauth2'; 

function Song({order,track}) {
    const spotifyApi = useSpotify();
    const [currentTrackId , setcurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying , setisPlaying] = useRecoilState(isPlayingState);
  
    // console.log(currentTrackIdState)
    const PlaySong = () => { 
      setcurrentTrackId(track.track.id);
      setisPlaying(true);
      spotifyApi.play({
        uris: [track.track.uri],
      })
    };
    

    return (
    <div className='grid grid-cols-2 text-gray-500 py-2 px-5 hover:bg-gray-900 rounded-lg cursor-pointer' onClick={PlaySong} >     
         <div className='flex items-center space-x-4' >
                <p>{order+1}</p>
                <img 
                className='h-12 w-12' 
                src={track?.track?.album.images[0].url}
                 alt="" />
            <div > 
                <p className='w-36 lg:w-64 truncate text-white'>{track.track.name}</p>
                <p className='w-40'>{track.track.artists[0].name}</p>
            </div>
         </div>
         <div className='flex items-center justify-between ml-auto md:ml-0' > 
                <p className='w-100 hidden md:inline'>{track.track.album.name}</p>
                <p>{millistoMinutesandSeconds(track.track.duration_ms)}</p>
        </div>
    </div>
  )
}

export default Song