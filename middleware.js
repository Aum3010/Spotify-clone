import { get } from "http";
// import { url } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextResponse ,NextRequest} from "next/server";



export async function middleware(req) {
    // token exists if user is logged in
    const token = await getToken({req , secret : process.env.JWT_SECRET});

    // 
    const {pathname , origin} = req.nextUrl

    // Allow the requests iin one of the following cases
    // 1) Its a request for next auth
    // If the token already exists
    if (pathname.includes("/api/auth" || token)){
        return NextResponse.next() // Let the user through
     }
    // const url = NextRequest.nextUrl.clone()
    // url.pathname = '/login'
    // return NextResponse.rewrite(url) 
    // return NextResponse.rewrite(new URL('/login', NextRequest.url))

    // url = pathname
    // // Else redirect them to the login page 
    // if (!token && pathname !== `/login`){
    //     return NextResponse.redirect(`${origin}/login`); 
    // }
}


