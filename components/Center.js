import {useSession} from "next-auth/react";
import {ChevronDownIcon} from "@heroicons/react/outline";
import {useState , useEffect} from "react";
import {shuffle} from "lodash";
import { useRecoilState , useRecoilValue} from 'recoil';
import {playlistState, playlistIdState} from "../atoms/playlistAtom"
import spotifyApi  from "../lib/spotify"
import SpotifyWebApi from "spotify-web-api-node";
import Songs from "./Songs";
import { signOut } from "next-auth/react";

const colours = [
    "from-red-500",
    "from-purple-500",
    "from-pink-500",
    "from-green-500",
    "from-yellow-500",
    "from-emerald-500",
    "from-blue-500",
    "from-indigo-500"
]

function Center() {
    const {data: session} = useSession();
    const [colour, setcolour] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);  
    const [playlist,setplaylist] = useRecoilState(playlistState)  
    useEffect(()=>{
        setcolour(shuffle(colours).pop());
    }
    ,[playlistId]);


    useEffect(() => {
        // console.log(playlistId)
        spotifyApi
        .getPlaylist(playlistId)
        .then((data)=>{
            setplaylist(data?.body);
        })
        .catch((err)=> console.log("Something Went Wrong",err))
    
    }, [spotifyApi,playlistId])
    // console.log(playlist)
    
  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
        <header className="absolute top-5 right-6"> 
            <div className="flex items-center  bg-black space-x-3 cursor-pointer p-1 pr-2 rounded-full opacity-90 hover:opacity-80 text-white " onClick={()=>signOut()}>
                <img  
                className="rounded-full w-12 h-10 "
                src={session?.user.image} alt="" />
                <h2 className="text-white "> {session?.user.name} </h2>  
            
                <ChevronDownIcon className="h-5 w-5 text-white"/>
                
            </div>
        </header>
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black text-white ${colour} p-8 h-80`}> 
            <img 
            className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""/>
            <div>
                <p>PLAYLIST</p>
                <h1 className="flex items-end text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
            </div>
        </section>
        <div>
            <Songs/>
        </div>

    </div>
  );
}

export default Center;

