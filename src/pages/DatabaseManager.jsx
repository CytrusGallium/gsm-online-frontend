import React from 'react';
import { FaDatabase } from 'react-icons/fa';
import FileUpload from '../components/FileUpload';
import { GetBackEndUrl } from '../const';
import { AwesomeButton } from 'react-awesome-button';

const DatabaseManager = () => {

    return (
        <div>
            {/* <FileUpload target={GetBackEndUrl() + "/api/install-database"} /> */}
            <br />
            <br />
            <AwesomeButton before={<FaDatabase />}><a href={GetBackEndUrl() + "/api/get-database"} target='_blank'>Télécharger la Base de Données</a></AwesomeButton>
        </div>
    )
}

export default DatabaseManager