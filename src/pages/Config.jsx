import React, { useState, useEffect } from 'react';
import { InputFieldStyle } from '../Styles';
import { AwesomeButton } from 'react-awesome-button';
import { GetPrintServerAddress, GetPrinterName, GetIfReducedPerformance } from '../const';
import AppData from '../App.json';

const Config = () => {

    // Effect
    useEffect(() => {

        setPrintServerAddress(GetPrintServerAddress());
        setPrinterName(GetPrinterName());
        setReducedPerformance(GetIfReducedPerformance());

        if (localStorage.getItem("footerNote")) {
            setFooterNote(localStorage.getItem("footerNote"));
        }

        if (localStorage.getItem("receiptWidth")) {
            setReceiptWidth(localStorage.getItem("receiptWidth"));
        } else {
            setReceiptWidth("72.1");
        }

        if (localStorage.getItem("sameProdPrepTimeModifier")) {
            setSameProdPrepTimeModifier(localStorage.getItem("sameProdPrepTimeModifier"));
            console.log(localStorage.getItem("sameProdPrepTimeModifier"));
        }

        if (localStorage.getItem("sameCatPrepTimeModifier")) {
            setSameCatPrepTimeModifier(localStorage.getItem("sameCatPrepTimeModifier"));
            console.log(localStorage.getItem("sameCatPrepTimeModifier"));
        }

    }, []);

    const [printServerAddress, setPrintServerAddress] = useState("");
    const [printerName, setPrinterName] = useState("");
    const [footerNote, setFooterNote] = useState("");
    const [receiptWidth, setReceiptWidth] = useState("");
    const [reducedPerformance, setReducedPerformance] = useState(false);
    const [sameProdPrepTimeModifier, setSameProdPrepTimeModifier] = useState(0.2);
    const [sameCatPrepTimeModifier, setSameCatPrepTimeModifier] = useState(0.5);
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

    const handleReducedPerformanceChange = () => {
        setReducedPerformance(!reducedPerformance);
        setChangesAvailable(true);
    };

    const handleSameProdPrepTimeModifierChange = (e) => {
        setSameProdPrepTimeModifier(e.target.value);
        setChangesAvailable(true);
    }

    const handleSameCatPrepTimeModifierChange = (e) => {
        setSameCatPrepTimeModifier(e.target.value);
        setChangesAvailable(true);
    }

    const saveBtnOnClick = () => {
        localStorage.setItem("printServerAddress", printServerAddress);
        localStorage.setItem("printerName", printerName);
        localStorage.setItem("footerNote", footerNote);
        localStorage.setItem("receiptWidth", receiptWidth);
        localStorage.setItem("reducedPerformance", reducedPerformance);
        localStorage.setItem("sameProdPrepTimeModifier", sameProdPrepTimeModifier);
        localStorage.setItem("sameCatPrepTimeModifier", sameCatPrepTimeModifier);
        setChangesAvailable(false);
    }

    useEffect(() => {
        // console.log("START-UP");
    }, []);

    return (
        <div>

            <br />

            <div className='border-2 rounded-xl border-gray-500 p-2 mx-4'>
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
                <label>
                    <input type="checkbox" checked={reducedPerformance} onChange={handleReducedPerformanceChange} className='mr-1 w-4 h-4' />
                    <p className='ml-1 text-gray-100 font-bold inline text-lg'>Performance Réduite</p>
                </label>
                <br />
            </div>

            <br />

            {AppData.CATERING_FLAG &&
                <div className='border-2 rounded-xl border-gray-500 p-2 mx-4'>
                    <label className='text-gray-100 text-sm'>Pourcentage de Temps de préparation du même produit : </label>
                    <br />
                    <input type='number' step='0.1' name='sameProdPrepTimeModifier' value={sameProdPrepTimeModifier} onChange={handleSameProdPrepTimeModifierChange} placeholder="Pourcentage de Temps de préparation du même produit..." className={InputFieldStyle} />
                    <br />
                    <label className='text-gray-100 text-sm'>Pourcentage de Temps de préparation de même catégorie : </label>
                    <br />
                    <input type='number' step='0.1' name='sameCatPrepTimeModifier' value={sameCatPrepTimeModifier} onChange={handleSameCatPrepTimeModifierChange} placeholder="Pourcentage de Temps de préparation de même categorie..." className={InputFieldStyle} />
                    <br />
                </div>
            }

            <br />
            {changesAvailable && <AwesomeButton type='primary' onPress={saveBtnOnClick} >Enregistrer</AwesomeButton>}
        </div>
    )
}

export default Config