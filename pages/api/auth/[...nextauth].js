
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi , { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try{
        spotifyApi.setAccessToken(token.access_token);
        spotifyApi.setRefreshToken(token.refresh_token);

        const {body: refreshedToken} = await spotifyApi.refreshAccessToken() ;
        return{
            ...token,
            access_token: refreshedtoken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // 1 hour as spotifyApi returns 3600
            refreshedToken: refreshedToken.access_token ?? token.refreshtoken, // refresh if the refrehed token comes back or else use the old one
        }
    } 
    catch(error){
        console.error(error);

        return{
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
      signIn:'/login'
  },
  callbacks: {
      async jwt({token,account,user}){

        // initial sign in
        if (account && user){
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000, //milliseconds time so multiply by 1000

            }
        }


        // return previous token if access token has not expired
        if (Date.now() < token.accessTokenExpires) {
            console.log("EXISTING ACCESS TOKEN IS VALID")
            return token;
        }

        // If access token expires then
        console.log("ACCESS TOKEN HAS EXPIRED , REFRESHING ...");
        return await refreshAccessToken(token);
        },

        async session({session,token})  {
            session.user.accessToken= token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session; 
        },
    },
})


