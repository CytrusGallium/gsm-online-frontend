import React from 'react';
import { useState } from 'react';
import { GetBackEndUrl } from '../const';
import axios from 'axios';
// import { AwesomeButton } from 'react-awesome-button';

const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

const ProviderEditor = () => {

    const [providerInfo, setProviderInfo] = useState({ firstName: "", familyName: "" });
    const [changesAvailable, setChangesAvailable] = useState(false);

    const handleChange = ({ currentTarget: input }) => {
        setProviderInfo({ ...providerInfo, [input.name]: input.value });
        setChangesAvailable(true);
    }

    const OnSubmit = async (event) => {

        event.preventDefault();

        try {

            let providerToPost = { firstName: providerInfo.firstName, familyName: providerInfo.familyName };
            let url = GetBackEndUrl() + "/api/new-provider";
            console.log("POST : " + url);
            let res = await axios.post(url, providerToPost);

            setChangesAvailable(false);

        } catch (error) {
            console.log("ERROR : " + error);
        }

    }

    return (
        <div>
            <br />
            <h3 className='text-gray-100 font-bold text-xl'>Ajouter un nouveau fournisseur</h3>
            <br />
            <form onSubmit={OnSubmit} className='flex flex-col'>
                <div>
                    <input type="text" name="firstName" className={inputFieldStyle} placeholder="Prénom du fournisseur..." value={providerInfo.firstName} onChange={handleChange} required />
                </div>
                <br />
                <div>
                    <input type="text" name="familyName" className={inputFieldStyle} placeholder="Nom du fournisseur..." value={providerInfo.familyName} onChange={handleChange} />
                </div>
                <div>
                    {changesAvailable && <button type="submit" className={buttonStyle}>Enregistrer</button>}
                </div>
            </form>
        </div>
    )
}

export default ProviderEditor