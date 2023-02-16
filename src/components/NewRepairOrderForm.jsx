import React, { useState, useEffect, useRef } from 'react';
import ProblemPriceGrid from './ProblemPriceGrid';
import RepairOrderItem from './RepairOrderItem';
import ReactTooltip from 'react-tooltip';
import { json } from 'react-router-dom';
import RepairOrderID from './RepairOrderID';
import { GetBackEndUrl, GetPrintServerAddress, GetPrinterName } from '../const';
import axios from "axios";
import { AwesomeButton } from 'react-awesome-button';
import { FaPrint, FaDownload } from 'react-icons/fa';
import { GetDateTimeDMYHM, GetShortDate, GetTimeHM2Digits } from '../Reaknotron/Libs/RknTimeTools';

// JS PDF
import "jspdf-barcode";
import autoTable from 'jspdf-autotable';
const jspdf = require('jspdf');

const printJS = require('print-js');
const html2canvas = require('html2canvas');
const ReactDOM = require('react-dom');
const Barcode = require('react-barcode');

var changesAvailable = false;

const NewRepairOrderForm = () => {

    useEffect(() => {
        // console.log("EFFECT-ONCE");
        // generatePDF();
    }, []);

    const customerRef = useRef(null);
    const phoneRef = useRef(null);

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
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

    const [repairOrder, setRepairOrder] = useState({ location: "Tlemcen", customer: "", phone: "" });
    var [items, setItems] = useState([{ key: 0, deviceType: "SMART_PHONE", ref: "", imei: "", problems: [{ key: 0, name: "", price: 0 }], estPrice: "0", price: "0", state: "PENDING" }]);
    const [dummy, setDummy] = useState(0);
    const [totalEstPrice, setTotalEstPrice] = useState(0);
    const [ROID, setROID] = useState("YYMMXXXXXXXX");

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({ ...repairOrder, [input.name]: input.value });
        changesAvailable = true;
    }

    const ConfirmOnClick = async (event) => {
        event.preventDefault();

        if (repairOrder.customer == "") {
            customerRef.current.focus();
            return;
        }
        else if (repairOrder.phone == "") {
            phoneRef.current.focus();
            return;
        }

        let itemToPost = { location: repairOrder.location, customer: repairOrder.customer, phone: repairOrder.phone, items: items, roid: ROID };
        // console.log(JSON.stringify(itemToPost));

        let res;
        const url = GetBackEndUrl() + "/api/update-repair-order";
        res = await axios.post(url, itemToPost);

        if (res) {
            // console.log("Update Item Result = " + res);
            changesAvailable = false;
            setDummy(dummy + 1);
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

    const RepairOrderIDOnChange = (ParamID) => {
        setROID(ParamID);
    }

    /**
     * Draws a dotted line on a jsPDF doc between two points.
     * Note that the segment length is adjusted a little so
     * that we end the line with a drawn segment and don't
     * overflow.
     */
    function dottedLine(ParamPDF, xFrom, yFrom, xTo, yTo, segmentLength) {
        // Calculate line length (c)
        var a = Math.abs(xTo - xFrom);
        var b = Math.abs(yTo - yFrom);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        // Make sure we have an odd number of line segments (drawn or blank)
        // to fit it nicely
        var fractions = c / segmentLength;
        var adjustedSegmentLength = (Math.floor(fractions) % 2 === 0) ? (c / Math.ceil(fractions)) : (c / Math.floor(fractions));

        // Calculate x, y deltas per segment
        var deltaX = adjustedSegmentLength * (a / c);
        var deltaY = adjustedSegmentLength * (b / c);

        var curX = xFrom, curY = yFrom;
        while (curX <= xTo && curY <= yTo) {
            ParamPDF.setLineWidth(0.25);
            ParamPDF.line(curX, curY, curX + deltaX, curY + deltaY);
            curX += 2 * deltaX;
            curY += 2 * deltaY;
        }
    }

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
            x: halfReceiptWidth-(halfReceiptWidth/2)-3,
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
            dottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
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
        dottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
        cursorY += 6;

        // Total estimated price
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text("Prix Estimé Total : " + totalEstPrice + " DA", halfReceiptWidth, cursorY, 'center');
        cursorY += 2;
        doc.setFont(undefined, 'normal');

        // Footer line
        dottedLine(doc, 5, cursorY, receiptWidth - 5, cursorY, 2);
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
        <div className='grid h-screen place-items-center'>
            <p className='text-gray-100 font-bold mb-4'>Ajouter Un Ordre de Réparation</p>
            <form>
                <input type="text" name="location" placeholder="Emplacement..." value={repairOrder.location} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <input type="text" ref={customerRef} name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <input type="text" ref={phoneRef} name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <RepairOrderID OnChange={RepairOrderIDOnChange} />
                <br />
                <div className='ml-10' id='barcode'>
                    <Barcode value={ROID} format="CODE128" width={1} height={24} />
                </div>
                <br />
                <br />
                <p className='text-gray-100 mt-4'>List des réparations :</p>
                {items.map(item => <RepairOrderItem key={item.key} id={item.key} onChange={itemOnChange} />)}
                <br />
                <button type="button" name='add-item' className={buttonStyle} onClick={AddItemOnClick}>+</button>
                <br />
                <br />
                <br />
                {changesAvailable && <button type="button" name='submit' className={buttonStyle} onClick={ConfirmOnClick}>Enregistrer Tout</button>}
                {/* <AwesomeButton onClick={ConfirmOnClick}>Enregistrer Tout</AwesomeButton> */}
            </form>
            <br />
            <br />
            <AwesomeButton type='primary' onPress={PrintPDF} before={<FaPrint />}>Imprimer le Bon</AwesomeButton>
            <br />
            <AwesomeButton type='primary' onPress={DownloadPDF} before={<FaDownload />}>Télécharger le Bon</AwesomeButton>
            <br />
            <br />
            <p>🚧🚧🚧</p>
        </div>
    )
}

export default NewRepairOrderForm