import React from 'react';
import { useState } from 'react';
import RepairOrderItem from './RepairOrderItem';
const printJS = require('print-js');
const html2canvas = require('html2canvas');
// const jspdf = require('jspdf');

const NewRepairOrderForm = () => {
  
    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

    function FormatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }
    
    let displayDate = FormatDate(new Date());

    const itemOnChange = (ParamItemState, ParamID) => {
        itemStates[ParamID] = ParamItemState;
        setTotalEstPrice(getTotalEstPrice());
    }

    const itemOnRemove = (ParamID) => {

        let index = -1;

        items.forEach(element => {
            
            if (element.key == ParamID)
                index = items.indexOf(element);
        });

        if (index > 0)
        {
            setItems(items.filter(item => item.key != ParamID));
            items.splice(index, 1);
        }
    }

    const [repairOrder, setRepairOrder] = useState({ location:"Tlemcen", customer:"", phone:"" });
    var [items, setItems] = useState([<RepairOrderItem key={1} id={1} onChange={itemOnChange} onRemove={itemOnRemove}/>]);
    var [itemStates, setItemStates] = useState([]);
    const [counter, setCounter] = useState(2);
    const [totalEstPrice, setTotalEstPrice] = useState(0);

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({...repairOrder, [input.name]: input.value });
    }

    const ConfirmOnClick = (event) => {
        event.preventDefault();
        
        // itemStates.forEach(item => {
        //     console.log("ITEM = " + item.imei);
        // });

        console.log(repairOrder);
    }

    const PrintHTML = () => {
        renderPrint();
    }

    const AddItemOnClick = (event) => {
        event.preventDefault();

        setCounter(counter => counter + 1);
        items.push(<RepairOrderItem key={counter} id={counter} onChange={itemOnChange} onRemove={itemOnRemove}/>);
    }

    const getTotalEstPrice = () => {
        let total = 0;
        itemStates.forEach(element => {
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

            var html  = '<html><head><title></title></head>';
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
            <br/>
                <input type="text" name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
            <br/>
                <input type="text" name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
            <br/>
                <p className='text-gray-100 mt-4'>List des réparations :</p>
            <br/>
                {items.map(item => item )}
            <br/>
                <button type="button" name='add-item' className={buttonStyle} onClick={AddItemOnClick}>+</button>
            <br/>
            <br/>
            <br/>
                <button type="button" name='submit' className={buttonStyle} onClick={ConfirmOnClick}>Enregistrer Tout</button>
            </form>
            <br/>
            <br/>
            <br/>

            {/* <p className='text-gray-100'>{errorMessage}</p> */}

            <h1 className='text-gray-100 text-3xl font-bold'>Aperçu Du Bon</h1>
            <br/>
            <div className='bg-gray-100 text-gray-900 border border-gray-900 w-128 p-2' id='printable'>
                <h1 className='text-2xl font-bold'>GSM Online</h1>
                <h3 className='text-sm font-bold'>Bon pour ordre de réparation</h3>
                <h5>{repairOrder.location} Le {displayDate}</h5>
                <br/>
                <p>Client : {repairOrder.customer}</p>
                <p>Tel : {repairOrder.phone}</p>
                <br/>
                <p>Liste des réparations : </p>
                <p>------------------------</p>
                {itemStates.map(item => 
                <div className='text-xs'>
                    <p>Model : {item.ref}</p>
                    <p>IMEI/NS : {item.imei}</p>
                    <p>Panne/Motif : {item.problem}</p>
                    <p>Prix Estimé : {item.estPrice}</p>
                    <p>------------------------</p>
                </div>
                )}
                <br/>
                <p className='font-bold'>Prix Estimé Total : {totalEstPrice} DA</p>
                <br/>
                <br/>
            </div>
            <br/>
            <br/>
            <button onClick={PrintHTML} className={buttonStyle}>Imprimer le Bon</button>
            <br/>
            <br/>
            {/* {canvas} */}
            <br/>
            <br/>
            <p>🚧🚧🚧</p>
        </div>
    )
}

export default NewRepairOrderForm