import React from 'react';
import { FaRegSadTear } from 'react-icons/fa';
import { AwesomeButton } from 'react-awesome-button';

const PleaseLogin = () => {
    return (
        <div className='text-gray-100 flex flex-col items-center'>
            <FaRegSadTear size={32} />
            <br/>
            <p>Il semble que vous n'êtes pas connecté...</p>
            <br/>
            <AwesomeButton type='primary'><a href='/'>Se Connecter</a></AwesomeButton>
        </div>
    )
}

export default PleaseLogin