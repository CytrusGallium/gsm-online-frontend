import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProblemPriceGrid from '../components/ProblemPriceGrid';
import RepairOrderItem from '../components/RepairOrderItem';
import ReactTooltip from 'react-tooltip';
// import { json } from 'react-router-dom';
import RepairOrderID from '../components/RepairOrderID';
import { GetBackEndUrl, GetPrintServerAddress, GetPrinterName } from '../const';
import axios from "axios";
import { AwesomeButton } from 'react-awesome-button';
import { FaPrint, FaDownload, FaCheckCircle, FaList, FaSave } from 'react-icons/fa';
import { GetDateTimeDMYHM, GetShortDate, GetTimeHM2Digits } from '../Reaknotron/Libs/RknTimeTools';
import GenericMessagePopup from '../components/GenericMessagePopup';
import { PulseLoader, CircleLoader } from 'react-spinners';
// import hotkeys from 'hotkeys-js';
// import { useHotkeys } from 'react-hotkeys-hook'

// JS PDF
import "jspdf-barcode";
import autoTable from 'jspdf-autotable';
import { DottedLine } from '../Reaknotron/Libs/RknPdfLibs';
const jspdf = require('jspdf');

// const printJS = require('print-js');
// const html2canvas = require('html2canvas');
// const ReactDOM = require('react-dom');
const Barcode = require('react-barcode');

var changesAvailable = false;
// var isSaving = false;
// var isPrinting = false;
// var disableF1 = false;
var isF1Down = false;

const NewRepairOrderForm = () => {

    useEffect(() => {

        // document.addEventListener("keydown", e => {
        //     if (e.key === "F1") {
        //         if (isF1Down) return;
        //         isF1Down = true;
        //         e.preventDefault();
        //         console.log("F1 Gen4");
        //         SaveAndPrint();
        //     }
        // });

        // document.addEventListener("keyup", e => {
        //     if (e.key === "F1") {
        //         isF1Down = false;
        //     }
        // });

        if (searchParams.get("id")) {
            // GetCateringOrderFromDB(searchParams.get("id"));
            GetRepairOrderFromDB(searchParams.get("id"));
        }
        else {
            // GenerateNewCateringOrder();
            GetNewIDFromDB();
        }

    }, []);

    const customerRef = useRef(null);
    const phoneRef = useRef(null);

    const inputFieldStyle = 'inline bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-1 m-auto';
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

    let displayDate = GetDateTimeDMYHM(new Date());

    const itemOnChange = (ParamItemState, ParamID) => {
        let tmpItems = items;
        tmpItems[ParamID] = ParamItemState;
        setItems(tmpItems);
        setTotalEstPrice(getTotalEstPrice());
        setDummy(dummy + 1);
        changesAvailable = true;
    }

    const itemOnRemove = (ParamID) => {

        let index = -1;

        items.forEach(element => {

            if (element.key == ParamID)
                index = items.indexOf(element);
        });

        if (index > 0) {
            setItems(items.filter(item => item.key != ParamID));
            items.splice(index, 1);
        }
    }

    // Navigation
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // var [items, setItems] = useState([{ key: 0, deviceType: "SMART_PHONE", ref: "", imei: "", problems: [{ key: 0, name: "", price: 0 }], estPrice: "0", price: "0", state: "PENDING" }]);
    const [repairOrder, setRepairOrder] = useState({ location: "Tlemcen", customer: "", phone: "" });
    const [items, setItems] = useState([{ key: 0, deviceType: "SMART_PHONE", ref: "", imei: "", problems: [{ key: 0, name: "", price: 0 }], estPrice: "0", price: "0", state: "PENDING" }]);
    const [dummy, setDummy] = useState(0);
    const [totalEstPrice, setTotalEstPrice] = useState(0);
    const [ROID, setROID] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [onError, setOnError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const GetNewIDFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            const url = GetBackEndUrl() + "/api/generate-empty-repair-order";
            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                setROID(res.data.id);
                navigate('/add-repair-order?id=' + res.data.id);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetRepairOrderFromDB = async (ParamROID) => {
        let res;

        try {

            // Build Req/Res
            const url = GetBackEndUrl() + "/api/get-repair-order?roid=" + ParamROID;
            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // this.UpdateID(res.data.id);

                setROID(res.data.roid);
                setItems(res.data.items);
                setRepairOrder({ location: res.data.location, customer: res.data.customer, phone: res.data.phone });
                // navigate('/add-repair-order?id=' + res.data.id);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    // useHotkeys('f1', function (event, handler) {
    //     event.preventDefault();
    //     console.log("F1 Hook");
    // }, { keydown:false, keyup:true, preventDefault:true });

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({ ...repairOrder, [input.name]: input.value });
        changesAvailable = true;
    }

    const SaveAndPrint = async () => {

        console.log("M1");
        if (!changesAvailable)
            return;

        console.log("M2");
        if (repairOrder.customer == "") {
            customerRef.current.focus();
            return;
        }
        else if (repairOrder.phone == "") {
            phoneRef.current.focus();
            return;
        }
        console.log("M3");

        Save();
        PrintPDF();
        console.log("M4");
    }

    const Save = async () => {

        if (!changesAvailable)
            return;

        if (repairOrder.customer == "") {
            customerRef.current.focus();
            return;
        }
        else if (repairOrder.phone == "") {
            phoneRef.current.focus();
            return;
        }

        setIsSaving(true);

        let res;

        try {

            let itemToPost = { 
                location: repairOrder.location, 
                customer: repairOrder.customer, 
                phone: repairOrder.phone, 
                items: items, 
                roid: ROID,
                estPrice : totalEstPrice 
            };

            const url = GetBackEndUrl() + "/api/update-repair-order";
            res = await axios.post(url, itemToPost);

            if (res) {
                // console.log("Update Item Result = " + res);
                changesAvailable = false;
                setDummy(dummy + 1);
                setIsSaving(false);
            }
            
        } catch (error) {
            setOnError(true);
            setErrorMessage("Impossible d'effectuer la sauvegarde, Veuillez contacter votre support technique si le problème persiste.")
            console.log("ERROR : " + error);
            
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                console.log(error.response.data);
            }

            setIsSaving(false);
        }
    }

    const AddItemOnClick = (event) => {
        event.preventDefault();

        let tmpItems = items;
        tmpItems[items.length] = { key: items.length, deviceType: "", ref: "", imei: "", problem: "", estPrice: "0", price: "0", state: "Encours de réparation..." };
        setItems(tmpItems);

        setDummy(dummy + 1);
        changesAvailable = true;
    }

    const getTotalEstPrice = () => {
        let total = 0;
        items.forEach(element => {
            total += Number(element.estPrice);
        });
        return total;
    }

    function Download(dataurl, filename) {
        const link = document.createElement("a");
        link.href = dataurl;
        link.download = filename;
        link.click();
    }

    /*
    const RepairOrderIDOnChange = (ParamID) => {
        setROID(ParamID);
        navigate('/add-repair-order?id=' + ParamID);
    }
    */

    const BuildPDF = async () => {

        var receiptWidth = 60;

        if (localStorage.getItem("receiptWidth")) {
            receiptWidth = Number(localStorage.getItem("receiptWidth"));
            console.log("RECEIPT WIDTH = " + receiptWidth);
        }

        const halfReceiptWidth = receiptWidth / 2;

        const doc = new jspdf.jsPDF('p', 'mm', [160, receiptWidth]); // Portrait, Milimeter, Height, Width
        var cursorY = 11;

        // GSM Online BG
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.rect(0, 0, 150, 15, 'DF');

        // GSM Online Text
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.text("GSM Online", halfReceiptWidth, cursorY, 'center');
        doc.setFont(undefined, 'normal');
        cursorY += 8;

        // Date
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetShortDate(), 1, cursorY, 'left');

        // Time
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetTimeHM2Digits(), receiptWidth - 1, cursorY, 'right');
        cursorY += 15;

        // ROID Barcode
        doc.barcode(ROID, {
            fontSize: 40,
            textColor: "#000000",
            x: halfReceiptWidth - (halfReceiptWidth / 2) - 3,
            // x: halfReceiptWidth/2,
            y: cursorY
        });
        cursorY += 4;

        // ROID
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(ROID, halfReceiptWidth, cursorY, 'center');
        cursorY += 8;

        // Customer name
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Client : " + repairOrder.customer, halfReceiptWidth, cursorY, 'center');
        cursorY += 4;

        // Phone Number
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Tel : " + repairOrder.phone, halfReceiptWidth, cursorY, 'center');
        cursorY += 3;

        items.forEach(item => {

            // Line 1
            DottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
            cursorY += 6;

            // Device model name
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("Model : " + item.ref, halfReceiptWidth, cursorY, 'center');
            cursorY += 4;

            // IMEI / Serial number
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text("IMEI/NS : " + item.imei, halfReceiptWidth, cursorY, 'center');
            cursorY += 4;

            // Problems Table
            if (item.problems && item.problems[0]) {

                if (item.problems.length == 1) {
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(11);
                    doc.text("Panne/Motif : " + item.problems[0].name, halfReceiptWidth, cursorY, 'center');
                    cursorY += 4;
                }
                else {
                    let bodyArray = [];

                    item.problems.forEach(p => {
                        bodyArray.push([p.name, p.price]);
                    });

                    autoTable(doc, {
                        head: [['Panne', 'Prix Estimé']],
                        body: bodyArray,
                        startY: cursorY,
                        margin: 2,
                        theme: 'grid',
                        tableWidth: receiptWidth - 4,
                        styles: {
                            fontSize: 10,
                            cellPadding: 1,
                            fontStyle: 'bold',
                            textColor: 'black'
                        },
                        headStyles: { fillColor: [24, 24, 24], textColor: 'white' },
                        didDrawPage: (d) => { cursorY = d.cursor.y }
                    });
                    cursorY += 2;
                }
            }
            else {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.text("Panne/Motif : Aucun", halfReceiptWidth, cursorY, 'center');
                cursorY += 4;
            }
        });

        // Final Line
        DottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
        cursorY += 6;

        // Total estimated price
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text("Prix Estimé Total : " + totalEstPrice + " DA", halfReceiptWidth, cursorY, 'center');
        cursorY += 2;
        doc.setFont(undefined, 'normal');

        // Footer line
        DottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
        cursorY += 4;

        // Footer note
        if (localStorage.getItem("footerNote")) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.text(localStorage.getItem("footerNote"), halfReceiptWidth, cursorY, 'center');
        }

        return doc;
    }

    const DownloadPDF = async () => {
        const doc = await BuildPDF();
        doc.save("Bon-GSM-Online.pdf");
    }

    const PrintPDF = async () => {

        // Build PDF
        const doc = await BuildPDF();

        // Build form
        const formData = new FormData();
        formData.append("pdf", doc.output('blob'));

        // Add token
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // Build Req/Res
        const response = await axios({
            method: "post",
            url: GetPrintServerAddress() + "?printer=" + GetPrinterName(),
            data: formData
        }, {}, () => console.log("CALLBACK"));
    }

    return (
        <div>
            {/* Toolbar */}
            <div className='fixed h-16 bg-gray-900 backdrop-blur bg-opacity-50 top-20 left-4 right-4 z-10 rounded-xl border-2 border-gray-500 flex flex-row items-center justify-center'>
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={Save} before={<FaSave size={24} />}><p className='hidden sm:block'>Enregistrer</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={'primary'} onPress={PrintPDF} before={<FaPrint size={24} />}><p className='hidden sm:block'>Imprimer le Bon</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={SaveAndPrint} before={<FaCheckCircle size={24} />}><p className='hidden sm:block'>Enregistrer & Imprimer (F1)</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type='primary' onPress={DownloadPDF} before={<FaDownload size={24} />}><p className='hidden sm:block'>Télécharger le Bon</p></AwesomeButton>
                <span className='mx-1' />
            </div>

            {/* Editor */}
            <div className='flex flex-col items-center'>
                <br />
                <br />
                <br />
                <br />
                <p className='text-gray-100 font-bold mb-4 text-xl'>Ordre de Réparation(s)</p>
                {/* <form> */}
                <div className='flex flex-row flex-wrap items-center m-2 border-2 border-gray-700 rounded-xl p-2'>
                    <span className='ml-1' />
                    <input type="text" name="location" placeholder="Emplacement..." value={repairOrder.location} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mx-0.5' />
                    <input type="text" ref={customerRef} name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mx-0.5' />
                    <input type="text" ref={phoneRef} name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mr-1' />
                </div>
                <div className='flex flex-row flex-wrap items-center m-2 border-2 border-gray-500 rounded-xl p-2 py-3 bg-gray-700'>
                    <RepairOrderID id={ROID} />
                    {ROID && <Barcode value={ROID} format="CODE128" width={2.4} height={36} displayValue={false} background='#00000000' lineColor="#999999" />}
                </div>
                <br />
                <div className='bg-gray-700 rounded-lg m-1 p-2'><FaList className='inline mr-1.5 mb-1' size={20} color='#CCCCCC' /><p className='inline text-gray-100 mt-4 font-bold text-lg'>Liste Des Appareils</p></div>
                
                {/* Item List */}
                {ROID && <div className='mx-2 flex flex-col items-center'>{items.map(item => <RepairOrderItem key={item.key} id={item.key} onChange={itemOnChange} value={item} />)}</div>}
                <br />
                <button type="button" name='add-item' className={buttonStyle} onClick={AddItemOnClick}>+</button>
                
                <br />
                <br />
                <GenericMessagePopup isOpen={isSaving} message={<div className='flex flex-col items-center' ><p>Sauvegarde en cours...</p><br /><CircleLoader color='#AAAAAA' /></div>} />
                <GenericMessagePopup isOpen={onError} onClose={() => setOnError(false)} message={errorMessage} closeButton={true} sad={true} />
            </div>
        </div>
    )
}

export default NewRepairOrderForm