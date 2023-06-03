import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RepairOrderItem from '../components/RepairOrderItem';
import RepairOrderID from '../components/RepairOrderID';
import { GetBackEndUrl, GetPrintServerAddress, GetPrinterName } from '../const';
import axios from "axios";
import { AwesomeButton } from 'react-awesome-button';
import { FaPrint, FaDownload, FaCheckCircle, FaList, FaSave, FaPlus } from 'react-icons/fa';
import { GetDateTimeDMYHM, GetShortDate, GetTimeHM2Digits } from '../Reaknotron/Libs/RknTimeTools';
import GenericMessagePopup from '../components/GenericMessagePopup';
import { CircleLoader } from 'react-spinners';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion } from "framer-motion";

// Dexie
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// JS PDF
import "jspdf-barcode";
import autoTable from 'jspdf-autotable';
import { DottedLine } from '../Reaknotron/Libs/RknPdfLibs';
const jspdf = require('jspdf');
const Barcode = require('react-barcode');

var changesAvailable = false;

const NewRepairOrderForm = () => {

    useHotkeys('m', () => {
        console.log("M");

        const db = new Dexie('rknLog');

        db.version(1).stores({
            actions: '++id, name, content',
        });

        db.table('actions').toArray().then(data => {
            console.log("DATA = " + JSON.stringify(data));
        }).catch(error => {
            console.error(error.stack || error);
        });
    }, []);

    useHotkeys('f1', (e) => {
        e.preventDefault();
        console.log("F1");
        // SaveAndPrint();
    }, []);

    useEffect(() => {

        if (searchParams.get("id")) {
            GetRepairOrderFromDB(searchParams.get("id"));
        }
        else {
            GetNewIDFromDB();
        }

    }, []);

    const customerRef = useRef(null);
    const phoneRef = useRef(null);

    const inputFieldStyle = 'inline bg-gray-50 border border-gray-300 text-gray-900 text-lg font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-1 m-auto';
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 pt-0 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2 text-3xl";

    const itemOnChange = (ParamID, ParamItemState, ParamProblems, ParamTotal) => {
        let tmpItems = items;
        tmpItems[ParamID] = ParamItemState;
        tmpItems[ParamID].problems = ParamProblems;
        tmpItems[ParamID].estPrice = ParamTotal;
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
    const defaultItemsState = [{ key: 0, deviceType: "SMART_PHONE", ref: "", imei: "", problems: [{ key: 1, name: "", price: 0 }], estPrice: "0", price: "0", state: "PENDING" }];

    const [repairOrder, setRepairOrder] = useState({ location: "Tlemcen", customer: "", phone: "" });
    const [items, setItems] = useState(defaultItemsState);
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
                setROID(res.data.roid);
                setItems(res.data.items);
                setRepairOrder({ location: res.data.location, customer: res.data.customer, phone: res.data.phone });
                setTotalEstPrice(getTotalEstPrice(res.data.items));
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({ ...repairOrder, [input.name]: input.value });
        changesAvailable = true;
    }

    const SaveAndPrint = async () => {

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

        Save();
        PrintPDF();
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
                estPrice: totalEstPrice
            };

            Dexie_RecordSaveAction(itemToPost);

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

        let tmpItems;
        if (items == null || items == '' || items == 0) {
            console.log("MARK A");
            tmpItems = defaultItemsState;
        }
        else {
            console.log("MARK B");
            tmpItems = items;
            tmpItems.push(defaultItemsState[0]);
            // tmpItems[items.length] = defaultItemsState[0];
            tmpItems[items.length - 1].key = items.length - 1;
        }

        setItems(tmpItems);

        setDummy(dummy + 1);
        changesAvailable = true;
    }

    const getTotalEstPrice = (ParamItems) => {

        var tmpItems;

        if (ParamItems)
            tmpItems = ParamItems;
        else
            tmpItems = items;

        let total = 0;
        tmpItems.forEach(element => {
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

    const BuildPDF = async () => {

        var receiptWidth = 60;

        if (localStorage.getItem("receiptWidth")) {
            receiptWidth = Number(localStorage.getItem("receiptWidth"));
            // console.log("RECEIPT WIDTH = " + receiptWidth);
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

    const Dexie_RecordSaveAction = async (ParamContent) => {

        const db = new Dexie('rknLog');

        db.version(1).stores({
            actions: '++id, name, content',
        });

        Dexie.exists('rknLog').then(exists => {
            if (exists) {
                // Database exists, do nothing
            } else {
                // Database does not exist, create it
                db.open();
            }
        }).catch(error => {
            // console.error(error.stack || error);
        });

        await db.actions.add({
            name: 'RO Save Attempt',
            content: ParamContent
        });

        db.table('actions').toArray().then(data => {
            // console.log("DATA = " + JSON.stringify(data));
        }).catch(error => {
            console.error(error.stack || error);
        });

    }

    return (
        <div>
            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='fixed h-16 bg-gray-900 backdrop-blur bg-opacity-50 top-20 left-4 right-4 z-10 rounded-xl border-2 border-gray-500 flex flex-row items-center justify-center'
            >
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={Save} before={<FaSave size={24} />}><p className='hidden sm:block text-lg'>Enregistrer</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={'primary'} onPress={PrintPDF} before={<FaPrint size={24} />}><p className='hidden sm:block text-lg'>Imprimer le Bon</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={SaveAndPrint} before={<FaCheckCircle size={24} />}><p className='hidden sm:block text-lg'>Enregistrer & Imprimer (F1)</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type='primary' onPress={DownloadPDF} before={<FaDownload size={24} />}><p className='hidden sm:block text-lg'>Télécharger le Bon</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type='primary' before={<FaPlus size={24} />}><a className='hidden sm:block text-lg' href={GetBaseUrl() + "/add-repair-order"}>Nouveau Bon</a></AwesomeButton>
            </motion.div>

            {/* Editor */}
            <div className='flex flex-col items-center'>
                <br />
                <br />
                <br />
                <br />
                <br />
                <motion.p className='text-gray-100 font-bold mb-4 text-xl' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>Ordre de Réparation(s)</motion.p>
                {/* <form> */}
                <motion.div className='flex flex-row flex-wrap items-center m-2 border-2 border-gray-700 rounded-xl p-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    <span className='ml-1' />
                    <input type="text" name="location" placeholder="Emplacement..." value={repairOrder.location} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mx-0.5' />
                    <input type="text" ref={customerRef} name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mx-0.5' />
                    <input type="text" ref={phoneRef} name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
                    <span className='mr-1' />
                </motion.div>

                {/* ROID */}
                <motion.div className='flex flex-row flex-wrap items-center m-2 border-2 border-gray-500 rounded-xl p-2 py-3 bg-gray-700' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
                    <RepairOrderID id={ROID} />
                    {ROID && <Barcode value={ROID} format="CODE128" width={2.4} height={36} displayValue={false} background='#00000000' lineColor="#999999" />}
                </motion.div>
                <br />

                {/* Label */}
                <motion.div className='bg-gray-700 rounded-lg m-1 p-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                    <FaList className='inline mr-1.5 mb-1' size={20} color='#CCCCCC' />
                    <p className='inline text-gray-100 mt-4 font-bold text-lg'>Liste Des Appareils</p>
                </motion.div>

                {/* Item List */}
                {ROID &&
                    <motion.div className='w-3/4 flex flex-col items-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
                        {
                            items.map(item =>
                                <RepairOrderItem
                                    key={item.key}
                                    id={item.key}
                                    onChange={itemOnChange}
                                    value={item}
                                />)
                        }
                    </motion.div>
                }
                <br />
                {items.length == 0 && <motion.button type="button" name='add-item' className={buttonStyle} onClick={AddItemOnClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}>+</motion.button>}

                <br />
                <br />
                <GenericMessagePopup isOpen={isSaving} message={<div className='flex flex-col items-center' ><p>Sauvegarde en cours...</p><br /><CircleLoader color='#AAAAAA' /></div>} />
                <GenericMessagePopup isOpen={onError} onClose={() => setOnError(false)} message={errorMessage} closeButton={true} sad={true} />
            </div>
        </div>
    )
}

export default NewRepairOrderForm