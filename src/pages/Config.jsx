import React, { useState, useEffect } from 'react';
import { InputFieldStyle } from '../Styles';
import { AwesomeButton } from 'react-awesome-button';
import { GetPrintServerAddress, GetPrinterName } from '../const';

const Config = () => {

    // Effect
    useEffect(() => {

        setPrintServerAddress(GetPrintServerAddress());
        setPrinterName(GetPrinterName());

        if (localStorage.getItem("footerNote")) {
            setFooterNote(localStorage.getItem("footerNote"));
        }

        if (localStorage.getItem("receiptWidth")) {
            setReceiptWidth(localStorage.getItem("receiptWidth"));
        }

    }, []);

    const [printServerAddress, setPrintServerAddress] = useState("");
    const [printerName, setPrinterName] = useState("");
    const [footerNote, setFooterNote] = useState("");
    const [receiptWidth, setReceiptWidth] = useState("");
    const [changesAvailable, setChangesAvailable] = useState(false);

    const handlePrintServerAddressChange = (e) => {
        setPrintServerAddress(e.target.value);
        setChangesAvailable(true);
    }

    const handlePrinterNameChange = (e) => {
        setPrinterName(e.target.value);
        setChangesAvailable(true);
    }

    const handleFooterNoteChange = (e) => {
        setFooterNote(e.target.value);
        setChangesAvailable(true);
    }
    
    const handleReceiptWidthChange = (e) => {
        setReceiptWidth(e.target.value);
        setChangesAvailable(true);
    }

    const saveBtnOnClick = () => {
        localStorage.setItem("printServerAddress", printServerAddress);
        localStorage.setItem("printerName", printerName);
        localStorage.setItem("footerNote", footerNote);
        localStorage.setItem("receiptWidth", receiptWidth);
        setChangesAvailable(false);
    }

    useEffect(() => {
        console.log("START-UP");
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
            <label className='text-gray-100 text-sm'>Note en bas du Bon : </label>
            <br />
            <input type='text' name='footerNote' value={footerNote} onChange={handleFooterNoteChange} placeholder="Note en bas du Ticket de Caisse..." className={InputFieldStyle} />
            <br />
            <br />
            <label className='text-gray-100 text-sm'>Largeur du Ticket de Caisse : </label>
            <br />
            <input type='number' name='receiptWidth' value={receiptWidth} onChange={handleReceiptWidthChange} placeholder="Largeur du Ticket de Caisse..." className={InputFieldStyle} />
            <br />
            <br />
            <br />
            {changesAvailable && <AwesomeButton type='primary' onPress={saveBtnOnClick} >Enregistrer</AwesomeButton>}
        </div>
    )
}

export default Config