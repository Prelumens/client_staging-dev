import React from 'react'
import { useEffect } from 'react'
const TimeOut = () => {
    useEffect(() => {
        document.title = "Time Out"
    }, []);
    return (
        <div className='timeout-background'>

        </div>
    )
}

export default TimeOut