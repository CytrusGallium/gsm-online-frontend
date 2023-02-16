import React, { useState, useEffect } from 'react';
import AppData from '../App.json';

const BackgroundVideo = () => {

    const [videoSource, setVideoSource] = useState(null);

    useEffect(() => {

        setVideoSource(require(`../assets/${AppData.BG_VIDEO}`));

    }, []);

    return (
        <div>
            <video src={videoSource} className='h-screen w-full object-cover opacity-80 fixed -z-10' autoPlay loop muted />
        </div>
    )
}

export default BackgroundVideo