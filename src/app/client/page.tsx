"use client"

import { useUser } from "@clerk/nextjs"

const ClientPage = () => {

    const { isLoaded, isSignedIn, user } = useUser();

    /**
     * true false null nếu người dùng chưa đăng nhập
     * true true oe {...} (Object) nếu người dùng đã đăng nhập
     */

    console.log(isLoaded, isSignedIn, user);

    /**
     * Nếu user chưa đăng nhập sẽ return về null
     */
    if(!isLoaded || !isSignedIn) {
        return null;
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center text-2xl">
            Hello, {user.firstName} welcome to Clerk
        </div>
    )
}

export default ClientPage