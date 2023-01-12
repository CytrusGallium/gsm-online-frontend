import { React, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaRegPaperPlane, FaTrash, FaCheckCircle, FaDownload, FaPlus } from 'react-icons/fa';
import NetImage from '../components/NetImage';
import { GetBackEndUrl, GetPrintServerAddress, GetPrinterName } from '../const';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import logo from '../Logo-Dar-Mima-Black.png'; // relative path to image
import logoTypo from '../Logo-Dar-Mima-Black-Typo.png'; // relative path to image
import { GetShortDate, GetTimeHM2Digits } from '../Reaknotron/Libs/RknTimeTools';
import '../VFX.css';
import '../ScrollBar.css';
import { AwesomeButton } from 'react-awesome-button';
import { MontserratArabicRegular_GetBinaryString } from "../Reaknotron/Fonts/Montserrat-Arabic-Regular";
import { NotoSansBold_GetBinaryString } from "../Reaknotron/Fonts/Noto-Sans-Bold";
import { SamimBold_GetBinaryString } from "../Reaknotron/Fonts/SamimBold";
const jspdf = require('jspdf');

const CateringSalesPoint = () => {

    // Effect
    useEffect(() => {

        console.log("BASE URL = " + GetBaseUrl());

        if (searchParams.get("id")) {
            GetCateringOrderFromDB(searchParams.get("id"));
        }
        else {
            GenerateNewCateringOrder();
        }

        GetCustomerSittingTablesListFromDb();
        GetProductListFromDb();

        updateCSTInterval = setInterval(GetCustomerSittingTablesListFromDb, 30000);

    }, []);

    const GetBaseUrl = () => {
        var baseUrl = '' + window.location;
        var pathArray = baseUrl.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;

        return url;
    }

    // Navigation
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [productList, setProductList] = useState([]);
    const [consumedProductsList, setConsumedProductsList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCounter, setProductCounter] = useState(1);
    const [customerSittingTables, setCustomerSittingTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(0);
    const [cateringOrderIDinDB, setCateringOrderIDinDB] = useState("");
    const [COID, setCOID] = useState(0);
    const [kitchenOrderIssued, setKitchenOrderIssued] = useState(false);
    const [finalized, setFinalized] = useState(false);
    const [categories, setCategories] = useState([]);

    const gridStyle = { display: 'grid', gridTemplateRows: '320px 256px' };
    const tableStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-500 text-lg font-bold flex flex-col justify-center items-center';
    const selectedTableStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold flex flex-col justify-center items-center';
    const occupiedTableStyle = 'inline m-1 p-1 text-gray-100 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold vfx-gradient-anim flex flex-col justify-center items-center';
    const hiddenTableStyle = 'inline m-1 p-1 text-gray-900 rounded-lg select-none bg-gray-500 text-lg font-bold opacity-20 flex flex-col justify-center items-center';

    var updateCSTInterval;

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
                getCategoryListFromDB();
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const getCategoryListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-category-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("CAT RESULT = " + JSON.stringify(res.data));
                setCategories(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetCateringOrderFromDB = async (ParamID) => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-catering-order?id=" + ParamID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("CO RESULT = " + JSON.stringify(res.data));
                setConsumedProductsList(res.data.consumedProducts);
                setCateringOrderIDinDB(res.data._id);
                setCOID(res.data.coid);
                setSelectedTable(res.data.customerSittingTableID);
                setKitchenOrderIssued(res.data.kitchenOrderIssued);
                setFinalized(res.data.finalized);

                // var customerSittingTable = customerSittingTables.filter(t => {
                //     return t._id === res.data.customerSittingTableID;
                // })
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetCustomerSittingTablesListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-customer-sitting-tables-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setCustomerSittingTables(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GenerateNewCateringOrder = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/generate-empty-catering-order";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                setCOID(res.data.coid);
                setCateringOrderIDinDB(res.data._id);
                navigate('/sales-point?id=' + res.data._id);
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

        // console.log(JSON.stringify(ParamProduct));
        let productInfo = { key: productCounter, id: ParamProduct._id, name: ParamProduct.name, price: ParamProduct.price, altLangName: ParamProduct.altLangName };
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

        if (!consumedProductsList)
            return 0;

        var total = 0;
        consumedProductsList.forEach(p => {
            total += p.price;
        });
        return total;
    }

    const handleClearAllOnClick = () => {
        if (finalized)
            return;

        setConsumedProductsList([]);
    }

    const IssueCateringOrder = async () => {

        if (finalized)
            return;

        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList, true, selectedTable, GetTotalPrice());

        // TODO : Mark table occupied
        if (selectedTable)
            MarkCustomerSittingTableOccupiedInDB(selectedTable, cateringOrderIDinDB);

        // ...
        setKitchenOrderIssued(true);

        // Print in kitchen
        const doc = await BuildKitchenPDF();
        await PrintKitchenPDF(doc);
    }

    const buildBatchedConsumedProductsArray = () => {
        var result = [];
        var arrayOfIDs = [];

        consumedProductsList.forEach(p => {

            if (result[p.id]) {
                let me = result[p.id];
                result[p.id] = { name: me.name, amount: me.amount + 1, price: me.price, altLangName: me.altLangName };
            } else {
                result[p.id] = { name: p.name, amount: 1, price: p.price, altLangName: p.altLangName };
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

    const buildConsumedProductsTableDataForPDF = (ParamBatchedConsumedProducts, ParamKitchenMode) => {

        // let head = [['Panne', 'Prix Estimé']];
        // ParamKitchenMode : in kitchen mode don't send price and total price
        var head = ['Designation', 'Qte', 'P.U', 'Montant'];
        if (ParamKitchenMode)
            head = ['Designation', 'Qte', 'الإسم'];

        let body = [];

        if (ParamKitchenMode) {
            ParamBatchedConsumedProducts.forEach(p => {
                let tableLine = [];
                tableLine.push(p.name);
                tableLine.push(p.amount);
                tableLine.push(p.altLangName);
                body.push(tableLine);
            });
        }
        else {
            ParamBatchedConsumedProducts.forEach(p => {
                let tableLine = [];
                tableLine.push(p.name);
                tableLine.push(p.amount);
                tableLine.push(p.price);
                tableLine.push(p.price * p.amount);
                body.push(tableLine);
            });
        }

        let result = { head: head, body: body };
        return result;
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

        const doc = new jspdf.jsPDF('p', 'mm', [192, receiptWidth]); // Portrait, Milimeter, Height, Width
        var cursorY = 20;

        // var logoImg = new Image();
        // logoImg.src = logo;
        // doc.addImage(logoImg, 'png', (receiptWidth - 24) / 2, -20, 24, 30);

        var logoImg = new Image();
        logoImg.src = logoTypo;
        doc.addImage(logoImg, 'png', (receiptWidth - 47) / 2, 0, 48, 16);

        // N°
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("Commande N° " + COID, halfReceiptWidth, cursorY, 'center');
        cursorY += 4;
        doc.setFont(undefined, 'normal');

        // SItting Table
        const tableLabel = GetCustomerSittingTableLabelInPrint();
        if (tableLabel && tableLabel != "") {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(tableLabel, halfReceiptWidth, cursorY, 'center');
            cursorY += 9;
            doc.setFont(undefined, 'normal');
        }
        else {
            cursorY += 5;
        }

        // Date
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetShortDate(), 3, cursorY, 'left');

        // Time
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetTimeHM2Digits(), receiptWidth - 3, cursorY, 'right');
        cursorY += 1;

        // Consumption table
        const products = buildBatchedConsumedProductsArray();
        const tableData = buildConsumedProductsTableDataForPDF(products);

        let cellTextFontSize = 10;
        autoTable(doc, {
            head: [tableData.head],
            body: tableData.body,
            startY: cursorY,
            margin: 2,
            theme: 'grid',
            tableWidth: receiptWidth - 4,
            styles: {
                fontSize: cellTextFontSize,
                cellPadding: 1,
                fontStyle: 'bold',
                textColor: 'black'
            },
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
            didDrawPage: (d) => { cursorY = d.cursor.y },
        });
        cursorY += 9;

        // Total
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("Total : " + GetTotalPrice() + " DA", halfReceiptWidth, cursorY, 'center');
        cursorY += 5;
        doc.setFont(undefined, 'normal');

        dottedLine(doc, 1, cursorY, receiptWidth - 1, cursorY, 1);
        cursorY += 3;

        doc.setFont(undefined, 'bold');
        doc.setFontSize(7);
        doc.text("Adresse : En face Center de formation, Imama", halfReceiptWidth, cursorY, 'center');
        cursorY += 3;
        doc.text("Téléphone : 05 40 95 13 17", halfReceiptWidth, cursorY, 'center');
        cursorY += 1;
        doc.setFont(undefined, 'normal');

        dottedLine(doc, 1, cursorY, receiptWidth - 1, cursorY, 1);
        cursorY += 7;

        if (localStorage.getItem("footerNote")) {
            doc.setFontSize(10);
            doc.text(localStorage.getItem("footerNote"), halfReceiptWidth, cursorY, 'center');
            cursorY += 9;
        }

        // console.log("H = " + doc.internal.pageSize.getHeight() + " C " + cursorY);

        return doc;
    }

    const BuildKitchenPDF = async () => {

        var receiptWidth = 60;
        if (localStorage.getItem("receiptWidth")) {
            receiptWidth = Number(localStorage.getItem("receiptWidth"));
            // console.log("RECEIPT WIDTH = " + receiptWidth);
        }

        const halfReceiptWidth = receiptWidth / 2;

        const doc = new jspdf.jsPDF('p', 'mm', [160, receiptWidth]); // Portrait, Milimeter, Height, Width
        // var cursorY = 40;
        var cursorY = 4;

        // N°
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("Commande N° " + COID, halfReceiptWidth, cursorY, 'center');
        cursorY += 4;
        doc.setFont(undefined, 'normal');

        // Sitting Table
        const tableLabel = GetCustomerSittingTableLabelInPrint();
        if (tableLabel && tableLabel != "") {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(tableLabel, halfReceiptWidth, cursorY, 'center');
            cursorY += 9;
            doc.setFont(undefined, 'normal');
        }
        else {
            cursorY += 5;
        }

        // Date
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetShortDate(), 1, cursorY, 'left');

        // Time
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetTimeHM2Digits(), receiptWidth - 1, cursorY, 'right');
        cursorY += 1;

        // Consumption table
        // const products = buildBatchedConsumedProductsArray();
        const products = buildBatchedConsumedProductsArray();
        const tableData = buildConsumedProductsTableDataForPDF(products, true);

        // const marBinary = MontserratArabicRegular_GetBinaryString();
        // const notoBinary = NotoSansBold_GetBinaryString();
        const samimBinary = SamimBold_GetBinaryString();
        doc.addFileToVFS('samim', samimBinary);
        doc.addFont('samim', 'samim', 'normal');
        // let fontID = doc.addFont('Montserrat-Arabic-Regular-normal.ttf', 'Montserrat-Arabic-Regular', 'normal');
        // console.log("FONT ID = " + fontID);

        // doc.setFont('Montserrat-Arabic-Regular');
        // doc.setTextColor(0, 0, 0);
        // doc.setFontSize(14);
        // doc.text(" حساء السمك ", halfReceiptWidth, cursorY, 'center');
        // cursorY += 4;

        autoTable(doc, {
            head: [tableData.head],
            body: tableData.body,
            startY: cursorY,
            margin: 1,
            theme: 'grid',
            tableWidth: receiptWidth - 2,
            styles: {
                fontSize: 12,
                cellPadding: 1,
                fontStyle: 'bold',
                textColor: 'black',
                font: 'samim'
            },
            // headStyles: [{ fillColor: [224, 224, 224] }, { fillColor: [160, 160, 160] }, { fillColor: [16, 16, 16] }],
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], halign: "center" },
            columnStyles: {
                2: { halign: "right" }
            },
            didDrawPage: (d) => { cursorY = d.cursor.y },
            tableLineWidth: 0.4,
            tableLineColor: [0, 0, 0],
            bodyStyles: { lineColor: [0, 0, 0] }
        });
        cursorY += 9;

        return doc;
    }

    const BuildKitchenOrderText = () => {
        var result = "";

        result += "Commande N° " + COID + "\n";
        result += GetCustomerSittingTableLabelInPrint() + "\n";
        result += "---------------------------" + "\n";
        consumedProductsList.forEach(p => {
            result += p.name + " X " + p.amount + "\n";
        });
        result += "---------------------------";
    }

    const FinalizeCateringOrder = async () => {

        if (finalized)
            return;

        // Print receipt
        PrintPDF();

        // Update in database
        MarkCustomerSittingTableFreeInDB(selectedTable);
        FinalizeCateringOrderInDB(cateringOrderIDinDB);

        // ...
        setFinalized(true);
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

    const PrintKitchenPDF = async (ParamPDF) => {

        // Build PDF
        // const doc = await BuildKitchenPDF();

        const doc = ParamPDF;

        // Build form
        const formData = new FormData();
        formData.append("pdf", doc.output('blob'));

        // Add token
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const url = GetPrintServerAddress() + "?printer=Kitchen"; // TODO : Config
        console.log("POST : " + url);

        // Build Req/Res
        const response = await axios({
            method: "post",
            // url: GetPrintServerAddress() + "?printer=" + GetPrinterName(),
            url: url,
            data: formData
        }, {}, () => console.log("CALLBACK"));
    }

    const UpdateCateringOrderInDB = async (ParamID, ParamConsumedProducts, ParamKitchenOrderIssued, ParamTableID, ParamTotalPrice) => {

        let cateringOrderToPost = { id: ParamID, consumedProducts: ParamConsumedProducts, kitchenOrderIssued: ParamKitchenOrderIssued, customerSittingTableID: ParamTableID, totalPrice: ParamTotalPrice };

        // Add token
        // const token = localStorage.getItem("token");
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        const url = GetBackEndUrl() + "/api/update-catering-order";
        console.log("POST : " + url);

        let res = await axios.post(url, cateringOrderToPost);
    }

    const MarkCustomerSittingTableOccupiedInDB = async (ParamID, ParamCateringOrderID) => {

        let cstToPost = { id: ParamID, cateringOrder: ParamCateringOrderID, occupied: true };

        // Add token
        // const token = localStorage.getItem("token");
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        const url = GetBackEndUrl() + "/api/update-customer-sitting-table";
        console.log("POST : " + url);

        let res = await axios.post(url, cstToPost);
        GetCustomerSittingTablesListFromDb();
    }

    const MarkCustomerSittingTableFreeInDB = async (ParamID) => {

        let cstToPost = { id: ParamID, cateringOrder: "", occupied: false };

        // Add token
        // const token = localStorage.getItem("token");
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        const url = GetBackEndUrl() + "/api/update-customer-sitting-table";
        console.log("POST : " + url);

        let res = await axios.post(url, cstToPost);
        GetCustomerSittingTablesListFromDb();
    }

    const FinalizeCateringOrderInDB = async (ParamID) => {

        let cateringOrderToPost = { id: ParamID, finalized: true, fulfilledPaiement: GetTotalPrice() };

        // Add token
        // const token = localStorage.getItem("token");
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        const url = GetBackEndUrl() + "/api/update-catering-order";
        console.log("POST : " + url);

        let res = await axios.post(url, cateringOrderToPost);
        GetCustomerSittingTablesListFromDb();
    }

    const downloadPDFOnClick = async () => {
        const docCheckout = await BuildPDF();
        docCheckout.save("Bon-Dar-Mima.pdf");

        const docKitchen = await BuildKitchenPDF();
        docKitchen.save("Bon-Dar-Mima-Cuisine.pdf");
    }

    const getCustomerSittingTableStyle = (ParamIsOccupied, ParamTableID) => {
        if (ParamIsOccupied)
            return occupiedTableStyle;
        else {
            if (kitchenOrderIssued)
                return hiddenTableStyle;
            else if (ParamTableID == selectedTable)
                return selectedTableStyle;
            else
                return tableStyle;
        }
    }

    const handleCSTonClick = (ParamTable) => {
        if (ParamTable.occupied) {
            // window.open("http://localhost:3000/sales-point?id=" + ParamTable.cateringOrder, '_blank').focus();
            // window.open(GetBaseUrl() + "/sales-point?id=" + ParamTable.cateringOrder, '_blank').focus();
            navigate("/sales-point?id=" + ParamTable.cateringOrder);
            navigate(0);
        } else if (!kitchenOrderIssued) {
            setSelectedTable(ParamTable._id);
        }
    }

    const GetCustomerSittingTableLabelInPrint = () => {
        if (selectedTable) {
            var result = customerSittingTables.find(t => {
                return t._id == selectedTable;
            });


            if (result) {
                return "Table " + result.name;
            }
        }

        return "";
    }

    return (
        <div>
            <div className='fixed right-4 top-16 mt-2 w-40 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton type={finalized ? 'disabled' : kitchenOrderIssued ? 'danger' : 'primary'} onPress={IssueCateringOrder} before={<FaRegPaperPlane size={24} />}>Commande</AwesomeButton></div></div>
            <div className='fixed right-4 top-32 mt-2 w-40 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton type={finalized ? 'disabled' : 'primary'} onPress={FinalizeCateringOrder} before={<FaCheckCircle size={24} />}>Paiment</AwesomeButton></div></div>
            <div className='fixed right-4 top-48 mt-2 w-40 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton type={finalized ? 'disabled' : 'primary'} onPress={handleClearAllOnClick} before={<FaTrash size={24} />}>Effacer</AwesomeButton></div></div>
            <div className='fixed right-4 top-64 mt-2 w-40 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton type='primary' onPress={downloadPDFOnClick} before={<FaDownload size={24} />}>Télécharger</AwesomeButton></div></div>
            <div className='fixed right-4 top-80 mt-2 w-40 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton type='primary' before={<FaPlus size={24} />}><a href={GetBaseUrl()+"/sales-point"}>Nouveau</a></AwesomeButton></div></div>

            {/* CST */}
            <div className='fixed h-28 bg-gray-900 rounded-xl left-2 text-gray-100 border-2 border-gray-100 right-48 z-10 top-16'>
                <div className='flex flex-wrap overflow-auto scrollbar h-24 m-1'>
                    {customerSittingTables.map(t => <p key={t._id} className={getCustomerSittingTableStyle(t.occupied, t._id)} onClick={() => handleCSTonClick(t)}>Table {t.name}</p>)}
                </div>
            </div>

            <div className='fixed h-12 bg-gray-900 rounded-xl left-2 text-gray-100 border-2 border-gray-100 right-48 top-44 z-10 grid grid-cols-3'>
                <div className='bg-gray-700 rounded-xl m-1 mr-0 text-lg font-bold pt-0.5'>Commande N° : {COID}</div>
                <div className='bg-gray-700 rounded-xl m-1 text-lg font-bold pt-0.5'>{selectedTable ? GetCustomerSittingTableLabelInPrint() : "Aucune Table"}</div>
                <div className='bg-gray-700 rounded-xl m-1 ml-0 text-lg font-bold pt-0.5'>Prix Total : {GetTotalPrice()} DA</div>
            </div>

            {/* Consumed Products */}
            <div className='fixed h-28 bg-gray-900 rounded-xl text-gray-100 py-2 border-2 border-gray-100 right-48 left-2 z-10 top-56 overflow-auto scrollbar'>
                <div className='flex flex-wrap'>
                    {consumedProductsList.length >= 1 ? consumedProductsList.map(p => <p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={p.key} onClick={() => handleProductRemove(p)}>{p.name}</p>) : <p className='flex items-center justify-center text-gray-300 h-20 w-full'>Aucun produit séléctionner...</p>}
                </div>
            </div>

            <div className='mt-72'>
                {/* Categorized Products */}
                {
                    categories.map(cat =>
                        <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2' key={cat._id}>
                            <p className='w-full text-xl font-bold text-gray-100 bg-gray-700'>{cat.name}</p><br />
                            <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48'>
                                {productList.map(p => p.category == cat._id && <NetImage value={p} key={p._id} onClick={() => handleProductOnClick(p)} />)}
                            </div>
                            <br />
                            <br />
                        </div>
                    )
                }

                {/* Non-Categorized Products */}
                <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2'>
                    <p className='w-full text-xl font-bold text-gray-100 bg-gray-700'>Divers</p><br />
                    {productList.map(p => p.category == "NULL" && <NetImage value={p} key={p._id} onClick={() => handleProductOnClick(p)} />)}
                    <br />
                    <br />
                </div>

            </div>

        </div>


    )
}

export default CateringSalesPoint