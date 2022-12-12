import React, { useState } from 'react';

const ConnexionSettings = () => {

    const [serverAddress, setServerAddress] = useState(localStorage.getItem("serverAddress"));

    const handleChange_for_select = ({ currentTarget: input }) => {
        setServerAddress(input.value);
        localStorage.setItem("serverAddress", input.value);
    }

    return (
        <div className='flex flex-col'>
            <h1 className='text-2xl text-gray-100'>Options De Connexion</h1>
            <br />
            <br />
            <label className='text-gray-100'>Adresse du Serveur</label>
            <input className='rounded m-2' type="text" value={serverAddress} onChange={handleChange_for_select}/>
            <select className='rounded m-2 text-gray-500 bg-gray-900' name="cars" id="cars" onChange={handleChange_for_select}>
                <option value="127.0.0.1:3000">127.0.0.1:3000</option>
                <option value="https://uttermost-first-gravity.glitch.me">https://uttermost-first-gravity.glitch.me</option>
                <option value="http://localhost:4000">http://localhost:4000</option>
                <option value="https://localhost:4000">https://localhost:4000</option>
            </select>
        </div>
    );
}

export default ConnexionSettings