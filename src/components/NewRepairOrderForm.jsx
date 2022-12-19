import React from 'react';
import { useState/*, useEffect*/ } from 'react';
import ProblemPriceGrid from './ProblemPriceGrid';
import RepairOrderItem from './RepairOrderItem';
import ReactTooltip from 'react-tooltip';
import { json } from 'react-router-dom';
import RepairOrderID from './RepairOrderID';
import GetBackEndUrl from '../const';
import axios from "axios";
import { AwesomeButton } from 'react-awesome-button';

const printJS = require('print-js');
const html2canvas = require('html2canvas');
// const jspdf = require('jspdf');
// const jsBarcode = require('jsbarcode');
const ReactDOM = require('react-dom');
const Barcode = require('react-barcode');

var changesAvailable = false;

const NewRepairOrderForm = () => {

    // useEffect(() => {
    //     console.log("EFFECT");
    // });

    // useEffect(() => {
    //     console.log("EFFECT-ONCE");
    // }, []);

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

    function FormatDate(ParamDate) {
        var d = new Date(ParamDate);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        var hour = '' + d.getHours();
        var minute = '' + d.getMinutes();

        if (month.length < 2)
            month = '0' + month;

        if (day.length < 2)
            day = '0' + day;

        if (hour.length < 2)
            hour = '0' + hour;

        if (minute.length < 2)
            minute = '0' + minute;

        return [day, month, year].join('-') + " " + [hour, minute].join(':');
    }

    let displayDate = FormatDate(new Date());

    const itemOnChange = (ParamItemState, ParamID) => {
        // console.log("MARK 4 : " + JSON.stringify(ParamItemState));
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
    // var [items, setItems] = useState([<RepairOrderItem key={1} id={1} onChange={itemOnChange} onRemove={itemOnRemove}/>]);
    var [items, setItems] = useState([{ key: 0, deviceType: "SMART_PHONE", ref: "", imei: "", problems: [{ key: 0, name: "", price: 0 }], estPrice: "0", price: "0", state: "PENDING" }]);
    // var [itemStates, setItemStates] = useState([]);
    // const [counter, setCounter] = useState(2);
    const [dummy, setDummy] = useState(0);
    const [totalEstPrice, setTotalEstPrice] = useState(0);
    const [ROID, setROID] = useState("YY-MM-XXXXXXXX");

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({ ...repairOrder, [input.name]: input.value });
        changesAvailable = true;
    }

    const ConfirmOnClick = async (event) => {
        event.preventDefault();
        let itemToPost = { location: repairOrder.location, customer: repairOrder.customer, phone: repairOrder.phone, items: items, roid: ROID };
        // console.log(JSON.stringify(itemToPost));

        let res;
        // const url = GetBackEndUrl() + "/api/add-repair-order";
        const url = GetBackEndUrl() + "/api/update-repair-order";
        res = await axios.post(url, itemToPost);

        if (res) {
            // console.log("Update Item Result = " + res);
            changesAvailable = false;
            setDummy(dummy + 1);
        }
    }

    const PrintHTML = () => {
        renderPrint();
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

    const renderPrint = () => {
        html2canvas(document.querySelector("#printable")).then(resultCanvas => {
            const img = resultCanvas.toDataURL('image/png');
            // Download(img, "TestImg.png");

            var html = '<html><head><title></title></head>';
            html += '<body style="width: 100%; padding: 0; margin: 0;"';
            html += ' onload="window.focus(); window.print(); window.close()">';
            html += '<img src="' + img + '" /></body></html>';

            var printWindow = window.open('', 'to_print', 'height=600,width=800');

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();
            // printWindow.close();
        });
    }

    const DownloadHTML = () => {
        html2canvas(document.querySelector("#printable")).then(resultCanvas => {
            const img = resultCanvas.toDataURL('image/bmp');
            Download(img, "Bon-GSM-Online.bmp");
        });
    }

    const RepairOrderIDOnChange = (ParamID) => {
        setROID(ParamID);
    }

    // const generatePDF = () => {
    //     const doc = new jspdf.jsPDF();
    //     doc.text("Hello world!", 10, 10);
    //     doc.save("a4.pdf");
    // }

    return (
        <div className='grid h-screen place-items-center'>
            <p className='text-gray-100 font-bold mb-4'>Ajouter Un Ordre de Réparation</p>
            <form>
                <input type="text" name="location" placeholder="Emplacement..." value={repairOrder.location} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <input type="text" name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <input type="text" name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
                <br />
                <RepairOrderID OnChange={RepairOrderIDOnChange} />
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
            <br />

            {/* <p className='text-gray-100'>{errorMessage}</p> */}

            <h1 className='text-gray-100 text-3xl font-bold'>Aperçu Du Bon</h1>
            <br />
            {/* <div className='bg-white text-black border border-gray-900 w-128 p-2 grid h-screen place-items-center' id='printable'></div> */}
            <div className='bg-white text-black border border-gray-900 w-128 p-2 m-2' id='printable'>
                <h1 className='text-3xl font-bold text-white bg-black pb-3'>GSM Online</h1>
                <h5>{displayDate}</h5>
                <br />
                <Barcode value={ROID} format="CODE128" width={1} height={24} />
                <br />
                <p>Client : {repairOrder.customer}</p>
                <p>Tel : {repairOrder.phone}</p>
                <br />
                {items.length > 1 && <p className='mb-3'>Liste des réparations : </p>}
                {items.map(item =>
                    <div className='text-xs border-dashed border-2 border-gray-500 mb-3 pb-3' key={item.key}>
                        <p>Model : {item.ref}</p>
                        <p className='pb-1'>IMEI/NS : {item.imei}</p>
                        {((item.problems && item.problems.length > 1) ? <ProblemPriceGrid problems={item.problems} /> : <p>Panne/Motif : {(item.problems) ? item.problems[0].name : ""}</p>)}
                        <p>Prix Estimé : {item.estPrice} DA</p>
                    </div>
                )}
                {items.length > 1 && <div><br /><p className='font-bold' data-tip="...">Prix Estimé Total : {totalEstPrice} DA</p><ReactTooltip /><br /></div>}
                <br />
            </div>
            <br />
            <br />
            <button onClick={PrintHTML} className={buttonStyle}>Imprimer le Bon</button>
            <button onClick={DownloadHTML} className={buttonStyle}>Télécharger le Bon</button>
            <br />
            <br />
            <p>🚧🚧🚧</p>
        </div>
    )
}

export default NewRepairOrderForm