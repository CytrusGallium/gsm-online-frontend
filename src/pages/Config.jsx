import React, { useState, useEffect } from 'react';
import { InputFieldStyle } from '../Styles';
import { AwesomeButton } from 'react-awesome-button';
import { GetPrintServerAddress, GetPrinterName } from '../const';

const Config = () => {

    const [printServerAddress, setPrintServerAddress] = useState("");
    const [printerName, setPrinterName] = useState("");
    const [changesAvailable, setChangesAvailable] = useState(false);

    const handlePrintServerAddressChange = (e) => {
        console.log(e.target.value);
        setPrintServerAddress(e.target.value);
        setChangesAvailable(true);
    }
    
    const handlePrinterNameChange = (e) => {
        console.log(e.target.value);
        setPrinterName(e.target.value);
        setChangesAvailable(true);
    }
    
    const saveBtnOnClick = () => {
        localStorage.setItem("printServerAddress", printServerAddress);
        localStorage.setItem("printerName", printerName);
        setChangesAvailable(false);
    }

    useEffect(() => {
        console.log("START-UP");
        setPrintServerAddress(GetPrintServerAddress());
        setPrinterName(GetPrinterName());
    }, []);

    return (
        <div>
            <label className='text-gray-100 text-sm'>Adresse du Serveur d'Impression : </label>
            <br />
            <input type='text' name='printServerAddress' value={printServerAddress} onChange={handlePrintServerAddressChange} placeholder="Adresse du Serveur d'Impression..." className={InputFieldStyle} />
            <br />
            <br />
            <label className='text-gray-100 text-sm'>Nom de l'Imprimante : </label>
            <br />
            <input type='text' name='printerName' value={printerName} onChange={handlePrinterNameChange} placeholder="Nom de l'Imprimante..." className={InputFieldStyle} />
            <br />
            <br />
            <br />
            {changesAvailable && <AwesomeButton type='primary' onPress={saveBtnOnClick} >Enregistrer</AwesomeButton>}
        </div>
    )
}

export default Config