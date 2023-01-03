import { React, useState, useEffect } from 'react';
import NetImage from '../components/NetImage';
import { GetBackEndUrl, GetPrintServerAddress, GetPrinterName } from '../const';
import axios from 'axios';
import { FaRegPaperPlane, FaTrash, FaCheckCircle, FaDownload } from 'react-icons/fa';
import autoTable from 'jspdf-autotable';
import logo from '../Logo-Dar-Mima-Black.png'; // relative path to image
import { GetShortDate, GetTimeHM2Digits } from '../Reaknotron/Libs/RknTimeTools';
const jspdf = require('jspdf');

const CateringSalesPoint = () => {

    useEffect(() => {
        GetProductListFromDb();
    }, []);

    const [productList, setProductList] = useState([]);
    const [consumedProductsList, setConsumedProductsList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCounter, setProductCounter] = useState(1);
    const [selectedTable, setSelectedTable] = useState(1);

    const gridStyle = { display: 'grid', gridTemplateRows: '320px 256px' };
    const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const tableStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-500 text-sm font-bold';
    const selectedTableStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-100 text-sm font-bold';

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setProductList(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const handleProductOnClick = (ParamProduct) => {

        setProductCounter(productCounter + 1);

        console.log(JSON.stringify(ParamProduct));
        let productInfo = { key: productCounter, id: ParamProduct._id, name: ParamProduct.name, price: ParamProduct.price };
        setConsumedProductsList(consumedProductsList => [...consumedProductsList, productInfo]);
    }

    const handleProductRemove = (ParamProduct) => {
        console.log(ParamProduct.key);
        var tmpArray = consumedProductsList.filter(function (p) {
            return p.key !== ParamProduct.key;
        });
        setConsumedProductsList(tmpArray);
    }

    const GetTotalPrice = () => {
        var total = 0;
        consumedProductsList.forEach(p => {
            total += p.price;
        });
        return total;
    }

    const handleClearAllOnClick = () => {
        setConsumedProductsList([]);
    }

    const buildBatchedConsumedProductsArray = () => {
        var result = [];
        var arrayOfIDs = [];

        consumedProductsList.forEach(p => {

            if (result[p.id]) {
                let me = result[p.id];
                result[p.id] = { name: me.name, amount: me.amount + 1, price: me.price };
            } else {
                result[p.id] = { name: p.name, amount: 1, price: p.price };
                arrayOfIDs.push(p.id);
            }

        });

        let finalResult = [];

        arrayOfIDs.forEach(id => {
            finalResult.push(result[id]);
        });

        console.log("FINAL RESULT = " + JSON.stringify(finalResult));

        return finalResult;
    }

    const buildConsumedProductsTableDataForPDF = (ParamBatchedConsumedProducts) => {
        // let head = [['Panne', 'Prix Estimé']];
        let head = ['Designation', 'Qte', 'P.U', 'Montant'];

        let body = [];
        ParamBatchedConsumedProducts.forEach(p => {
            let tableLine = [];
            tableLine.push(p.name);
            tableLine.push(p.amount);
            tableLine.push(p.price);
            tableLine.push(p.price * p.amount);
            body.push(tableLine);
        });

        let result = { head: head, body: body };

        // console.log("TABLE RESULT = " + JSON.stringify(result));

        return result;
    }

    const BuildPDF = async () => {

        const doc = new jspdf.jsPDF('p', 'mm', [160, 60]); // Portrait, Milimeter, Height, Width
        var cursorY = 40;
        // var barcodeImg;
        // var html2CanvasResult = await html2canvas(document.querySelector("#barcode"));
        // var barcodeImg = html2CanvasResult.toDataURL('image/bmp');

        var logoImg = new Image();
        logoImg.src = logo;
        doc.addImage(logoImg, 'png', 20, 2, 24, 30);

        // N°
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("N° 23-000001", 30, cursorY, 'center');
        cursorY += 4;
        doc.setFont(undefined, 'normal');

        // SItting Table
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Table " + selectedTable, 30, cursorY, 'center');
        cursorY += 9;
        doc.setFont(undefined, 'normal');

        // Consumption table
        const products = buildBatchedConsumedProductsArray();
        const tableData = buildConsumedProductsTableDataForPDF(products);

        let fontSize = 8;
        autoTable(doc, {
            head: [tableData.head],
            body: tableData.body,
            startY: cursorY,
            margin: 2,
            theme: 'grid',
            tableWidth: 56,
            styles: {
                fontSize: fontSize,
                cellPadding: 1, fontStyle:'bold'
            },
            headStyles: { fillColor: [24, 24, 24] }
        });
        cursorY += (fontSize + (fontSize*consumedProductsList.length))/2;

        // Total
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Total : " + GetTotalPrice() + " DA", 30, cursorY, 'center');
        cursorY += 9;

        // // GSM Online BG
        // doc.setDrawColor(0, 0, 0);
        // doc.setFillColor(0, 0, 0);
        // doc.setLineWidth(1);
        // doc.rect(0, 0, 150, 15, 'DF');

        // // GSM Online Text
        // doc.setFont(undefined, 'bold');
        // doc.setTextColor(255, 255, 255);
        // doc.setFontSize(26);
        // doc.text("GSM Online", 30, cursorY, 'center');
        // cursorY += 9;

        // // Reset font weight
        // doc.setFont(undefined, 'normal');

        // // Date
        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(8);
        // doc.text(GetShortDate(), 1, cursorY, 'left');

        // // Time
        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(8);
        // doc.text(GetTimeHM2Digits(), 59, cursorY, 'right');
        // cursorY += 3;

        // doc.addImage(barcodeImg, 'bmp', 10, cursorY, 50, 15);
        // cursorY += 20;

        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(10);
        // doc.text("Client : " + repairOrder.customer, 30, cursorY, 'center');
        // cursorY += 4;

        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(10);
        // doc.text("Tel : " + repairOrder.phone, 30, cursorY, 'center');
        // cursorY += 8;

        // // Line 1
        // dottedLine(doc, 5, cursorY, 55, cursorY, 2);
        // cursorY += 8;

        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(10);
        // doc.text("Model : " + items[0].ref, 30, cursorY, 'center');
        // cursorY += 4;

        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(10);
        // doc.text("IMEI/NS : " + items[0].imei, 30, cursorY, 'center');
        // cursorY += 4;

        // if (items[0].problems && items[0].problems[0]) {

        //     if (items[0].problems.length == 1) {
        //         doc.setTextColor(0, 0, 0);
        //         doc.setFontSize(10);
        //         doc.text("Panne/Motif : " + items[0].problems[0].name, 30, cursorY, 'center');
        //         cursorY += 4;
        //     }
        //     else {
        //         autoTable(doc, {
        //             head: [['Panne', 'Prix Estimé']],
        //             body: [
        //                 ['Ecran', '12000'],
        //                 ['HP', '600'],
        //             ],
        //             startY: cursorY,
        //             margin: 2,
        //             theme: 'grid',
        //             tableWidth: 56,
        //             styles: {
        //                 fontSize: 6,
        //                 cellPadding: 1
        //             },
        //             headStyles: { fillColor: [24, 24, 24] }
        //         });
        //         cursorY += 12;
        //     }

        //     // doc.setTextColor(0, 0, 0);
        //     // doc.setFontSize(10);
        //     // doc.text("Prix Estimé : " + items[0].problems[0].price, 30, cursorY, 'center');
        //     // cursorY += 8;

        // }
        // else {
        //     doc.setTextColor(0, 0, 0);
        //     doc.setFontSize(10);
        //     doc.text("Panne/Motif : Aucun", 30, cursorY, 'center');
        //     cursorY += 4;
        // }

        // // Line 2
        // dottedLine(doc, 5, cursorY, 55, cursorY, 2);
        // cursorY += 10;

        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(12);
        // doc.text("Prix Estimé Total : " + totalEstPrice + " DA", 30, cursorY, 'center');
        // cursorY += 8;

        return doc;
    }

    // const DownloadPDF = async () => {
    //     const doc = await BuildPDF();
    //     doc.save("Bon-Dar-Mima.pdf");
    // }

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

    const downloadPDFOnClick = async () => {
        const doc = await BuildPDF();
        doc.save("Bon-Dar-Mima.pdf");
    }

    return (
        <div className='m-auto'>
            <div className='fixed right-4 top-16 mt-2 w-40 h-12 cursor-pointer bg-gray-300 hover:bg-gray-100 p-1 text-gray-900 font-bold rounded-xl'><div className='mt-2'><FaRegPaperPlane color='#111111' size={24} className="inline mr-2" />Commande</div></div>
            <div className='fixed right-4 top-32 mt-2 w-40 h-12 cursor-pointer bg-gray-300 hover:bg-gray-100 p-1 text-gray-900 font-bold rounded-xl' onClick={PrintPDF}><div className='mt-2'><FaCheckCircle color='#111111' size={24} className="inline mr-2" />Paiment</div></div>
            <div className='fixed right-4 top-48 mt-2 w-40 h-12 cursor-pointer bg-gray-300 hover:bg-gray-100 p-1 text-gray-900 font-bold rounded-xl' onClick={handleClearAllOnClick}><div className='mt-2'><FaTrash color='#111111' size={24} className="inline mr-2" />Effacer</div></div>
            <div className='fixed right-4 top-64 mt-2 w-40 h-12 cursor-pointer bg-gray-300 hover:bg-gray-100 p-1 text-gray-900 font-bold rounded-xl' onClick={downloadPDFOnClick}><div className='mt-2'><FaDownload color='#111111' size={24} className="inline mr-2" />Télécharger</div></div>
            <div className='flex flex-wrap bg-gray-900 rounded-xl ml-4 text-gray-100 py-4 border-2 border-gray-100 mr-48'>
                {tables.map(t => <p key={t} className={t == selectedTable ? selectedTableStyle : tableStyle} onClick={() => setSelectedTable(t)}>Table {t}</p>)}
            </div>
            <br />
            <div className='flex flex-wrap bg-gray-800 pb-8 ml-4 rounded-3xl mr-48'>
                {productList.map(p => <NetImage value={p} key={p._id} onClick={() => handleProductOnClick(p)} />)}
            </div>
            <br />
            <br />
            <div className='bg-gray-900 rounded-xl ml-4 text-gray-100 py-4 border-2 border-gray-100 mr-48'>
                <p>La commande du client :</p>
                <br />
                <div className='flex flex-wrap'>
                    {consumedProductsList.map(p => <p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={p.key} onClick={() => handleProductRemove(p)}>{p.name}</p>)}
                </div>
                <br />
                <div className='text-gray-500'>---------------------------------------------------------------</div>
                <p className='my-4 text-3xl font-bold'>Prix Total : {GetTotalPrice()} DA</p>
            </div>
        </div>
    )
}

export default CateringSalesPoint