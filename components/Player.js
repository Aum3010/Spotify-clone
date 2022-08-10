import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { currentTrackIdState , isPlayingState } from "../atoms/songAtom"
import { useEffect, useState } from 'react';
import {useSession} from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";
import { PauseIcon, SwitchHorizontalIcon } from '@heroicons/react/outline/';
import { FastForwardIcon, PlayIcon ,ReplyIcon, RewindIcon } from '@heroicons/react/solid/';


export default function Player() {
    const spotifyApi = useSpotify();
    const {data: session , status} = useSession();
    const [currentTrackId , setcurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying , setisPlaying] = useRecoilState(isPlayingState);
    const [Volume,setVolume] = useState(50);
    
    const SongInfo = useSongInfo();

    const fetchCurrentSong = () => {
      if(!SongInfo){
        spotifyApi.getMyCurrentPlayingTrack().then((data)=>{
          console.log("Now Playing" ,data.body?.item)
          setcurrentTrackId(data?.body?.item?.id);
        })
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
          setisPlaying(data.body?.is_playing);
        })
      }
    }

    useEffect(() => {
     if(spotifyApi.getAccessToken() && !currentTrackId){
      // fetches the current song
      fetchCurrentSong();
      setVolume(50);
     }
    }, [currentTrackIdState,spotifyApi,session])

    const handlePlayPause = () => {
      spotifyApi.getMyCurrentPlaybackState.then((data)=>{
        if (data.body.is_Playing){
          spotifyApi.pause()
          setisPlaying(false);
        }
        else{
          spotifyApi.play();
          setisPlaying(true);
        }
      })
    }
    


  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900  text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div className='flex items-center space-x-4 '>
          <img className='hidden md:inline h-12 w-12' src={SongInfo?.album?.images?.[0]?.url}  />
          <div>
            <h3>{SongInfo?.name}</h3>
            <p>{SongInfo?.artists?.[0]?.name}</p>
          </div>
        </div>

        <div className='flex items-center justify-evenly'>
          <SwitchHorizontalIcon className='button' />
          <RewindIcon onClick={()=> spotifyApi.skipToPrevious()} className='button'/>
          {isPlaying ? (<PauseIcon onClick={()=> 
          {
            handlePlayPause;
          }}
          
          className='button w-10 h-10 '/>) 
          : (
          <PlayIcon onClick={()=>  
            {
              handlePlayPause;
            }} 
          
          className='button w-10 h-10'/>
          )}
          <FastForwardIcon onClick={()=> spotifyApi.skipToNext()} className='button'/>

          <ReplyIcon className='button'/>
        </div>
        
    </div>
    
  )
}
