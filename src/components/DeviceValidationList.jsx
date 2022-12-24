import React from 'react';
import DeviceStateSelector from './DeviceStateSelector';
import { FaDollarSign } from 'react-icons/fa';

const DeviceValidationList = (props) => {
    return (
        <div>
            <div className='grid grid-cols-2'>
                <div className='border border-sky-500 p-2'>
                    <p>Phone Icon and Name</p>
                    <p><FaDollarSign className='inline'/> Prix Total Estimé : 1500 DA</p>
                    </div>
                <div className='border border-sky-500 p-2'>
                    <p>COL 2 - Line 1</p>
                    <p>COL 2 - Line 2</p>
                    <p>COL 2 - Line 3</p>
                </div>
            </div>
            {props.value.map(item => <div className='my-2' key={item.key}><DeviceStateSelector value={item.state} /></div>)}
            <div>Prix Total Estimé</div>
        </div>
    )
}

export default DeviceValidationList