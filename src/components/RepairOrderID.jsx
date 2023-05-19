import React from 'react';
import { PulseLoader } from 'react-spinners';

const RepairOrderID = (props) => {

    return (
        <div className='text-gray-100 font-bold text-xl'>{(props.id == null || props.id == "") ? <PulseLoader color='#AAAAAA' /> : <div><span className='text-gray-500 mr-2'>IDENTIFIANT</span><span className='bg-gray-900 rounded-lg m-1 p-2 border-2 border-teal-700'>{props.id}</span></div>}</div>
    )
}

export default RepairOrderID