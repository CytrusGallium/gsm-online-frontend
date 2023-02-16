import React from 'react';
import AppData from '../App.json';
import { GetIfReducedPerformance } from '../const';

const MainMenuCard = (props) => {

    const color = AppData.PRIMARY_COLOR;
    // console.log(color);

    const reducedPerfValue = GetIfReducedPerformance();
    
    var NO_BLUR = false;
    if (reducedPerfValue == "true")
        NO_BLUR = true;

    return (
        <div className={'text-xl font-bold text-yellow-100 w-48 h-64 rounded-3xl backdrop-blur border-2 border-yellow-700 shadow-3xl bg-yellow-500 bg-opacity-0 shadow-[0_15px_16px_-5px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_16px_-5px_rgba(0,0,0,0.9)] hover:bg-opacity-10 hover:border-yellow-500 m-2'}>
        {/* <div className={NO_BLUR ? `text-xl font-bold text-${color}-100 w-48 h-64 rounded-3xl border-2 border-${color}-700 shadow-3xl bg-gray-800 bg-opacity-75 shadow-[0_15px_16px_-5px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_16px_-5px_rgba(0,0,0,0.9)] hover:bg-opacity-95 hover:border-${color}-500 m-2` : `text-xl font-bold text-${color}-100 w-48 h-64 rounded-3xl backdrop-blur border-2 border-${color}-700 shadow-3xl bg-${color}-500 bg-opacity-0 shadow-[0_15px_16px_-5px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_16px_-5px_rgba(0,0,0,0.9)] hover:bg-opacity-10 hover:border-${color}-500 m-2`}> */}
            <a href={props.href} className='flex flex-col items-center w-full h-full'>

                {/* Before */}
                <div className='inline mt-16'>
                    {props.before && props.before}
                </div>

                {/* Label */}
                <div className='mt-1 p-2'>
                    {props.label ? props.label : "? Label ?"}
                </div>

            </a>
        </div>
    )
}

export default MainMenuCard