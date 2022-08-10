import React, { useState , useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify"

export default function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentIdTrack , setcurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [SongInfo, setsongInfo] = useState(null);
    
   useEffect(() => {
    const fetchsongInfo = async () =>{
        if (currentIdTrack) {
        const trackInfo = await fetch(
            `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
            {
                headers: {
                        "Authorization"  : `Bearer ${spotifyApi.getAccessToken()}`,
                        // "Access-Control-Allow-Origin": "*",
                        // "Access-Control-Allow-Credentials": "true",
                        // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
                        // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
                },
            }
        ).then((res) => res.json());
        setsongInfo(trackInfo);
    }
};
    fetchsongInfo();
   }, [currentIdTrack , spotifyApi]);
   
  
  
    return SongInfo
}
