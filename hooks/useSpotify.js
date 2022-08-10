import React from 'react'
import { useEffect } from 'react';
import {signIn , useSession} from "next-auth/react";
import SpotifyWebApi from 'spotify-web-api-node';
import spotifyApi from '../lib/spotify';

export default function useSpotify() {
    const {data: session , status} = useSession();

    useEffect(() => {
        if (session){
            // If refresh access token fails then directly back to sign in page
            if(session.error === "RefreshAccessTokenError"){
                signIn();
            }
            spotifyApi.setAccessToken(session.user.accessToken);
        }
      }
    , [session])
    

  return spotifyApi;
}
