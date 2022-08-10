import React, { useState , useEffect} from 'react';
import {
    HomeIcon,
    SearchIcon,
    PlusCircleIcon,
    CollectionIcon,
    HeartIcon,
    RssIcon,
    LogoutIcon,
} from "@heroicons/react/outline"

import {signOut, useSession} from "next-auth/react"; 
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from 'recoil';
import {playlistIdState} from "../atoms/playlistAtom";

function sidebar() {
    const spotifyApi = useSpotify();
    const {data: session , status} = useSession();
    const [playlists, setplaylists] = useState([]);
    const [playlistId, setplaylistId] = useRecoilState(playlistIdState);
    
    // console.log("playlist = ",playlistId)

        useEffect(() => {
          if (spotifyApi.getAccessToken()){
            // console.log(playlists)
            spotifyApi.getUserPlaylists().then(
                (data)=> 
                {
                    setplaylists(data.body.items);
            });
          }
        
        }, [session,spotifyApi]);

        // console.log(playlists)
        
    return (
    <div className="text-gray-500 p-5  border-r border-gray-900 space-y-4 overflow-y-scroll scrollbar-hide h-screen  text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] pb-36 `">
        <div className="space-y-2">
                    

            <button className="flex items-center space-x-2 hover:text-white">
                <HomeIcon className="h-5 w-5"/>
                <p>Home</p>

            </button>
            <button className="flex items-center space-x-2 hover:text-white">
                <SearchIcon className="h-5 w-5"/>
                <p>Search</p>   
            </button>
            
            <button className="flex items-center space-x-2 hover:text-white">
                <CollectionIcon className="h-5 w-5"/>
                <p>Your Library</p>   
            </button>

        </div>
    
        <hr className="border-t-[0.1px] border-gray-900"></hr>
    
        <div className="space-y-2">
            <button className="flex items-center space-x-2 hover:text-white">
                <PlusCircleIcon className="h-5 w-5"/>
                <p>Create Playlist</p>

            </button>
            <button className="flex items-center space-x-2 hover:text-white">
                <HeartIcon className="h-5 w-5"/>
                <p>Liked Songs</p>   
            </button>
            
            <button className="flex items-center space-x-2 hover:text-white">
                <RssIcon className="h-5 w-5"/>
                <p>Your Episodes</p>    
            </button>    
        </div>
    
        <hr className="border-t-[0.1px] border-gray-900"></hr>


        {playlists.map((playlist)=>(
                    <p key={playlist.id} 
                    onClick= {()=> setplaylistId(playlist.id)}        
                    className="cursor-pointer hover:text-white">{playlist.name}</p>
        ))}

    </div>
  )
}

export default sidebar;

