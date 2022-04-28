import React from 'react'
import { useRouter } from "next/router";
import ReactPlayer from 'react-player'

const welcome = () => {
    //router
    const router = useRouter();

    const handleClick = () => {
        router.push('/user')
    }
    return (
        <>
            <ReactPlayer
                url="https://www.youtube.com/watch?v=oAlux0X5TyY"
                playing={true}
                loop={true}
                width="0"
                height="0"
                volume="1"
            />
            <div className='welcome-screen' onClick={handleClick}>

            </div>
        </>

    )
}

export default welcome