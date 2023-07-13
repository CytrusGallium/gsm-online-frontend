import React from 'react';
import { PulseLoader, ClimbingBoxLoader, PacmanLoader } from 'react-spinners';

const RknLoaderPopup = (props) => {
    return (
        <div className='bg-black bg-opacity-60 backdrop-blur fixed top-0 w-screen h-screen z-40 flex items-center justify-center'>
            <div className='bg-gray-900 border-4 border-gray-500 rounded-xl w-1/3 h-1/3 flex items-center justify-center'>
                {props.loader && props.loader == "pacman" && <PacmanLoader color='#CCCCCC'/>}
                {!props.loader && <ClimbingBoxLoader color='#CCCCCC'/>}
            </div>
        </div>
    )
}

export default RknLoaderPopup