import { React, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaRegPaperPlane, FaTrash, FaCheckCircle, FaDownload, FaPlus, FaChair, FaSave, FaPizzaSlice } from 'react-icons/fa';
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
import { SamimBold_GetBinaryString } from "../Reaknotron/Fonts/SamimBold";
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import ConsumedProductTag from '../components/ConsumedProductTag';
import CateringSalesPointPaymentPopup from '../components/CateringSalesPointPaymentPopup';
import AddMiscProductPopup from '../components/AddMiscProductPopup';
import CustomAmountPopup from '../components/CustomAmountPopup';
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

        // updateCSTInterval = setInterval(GetCustomerSittingTablesListFromDb, 30000);

        // document.addEventListener("contextmenu", (event) => {
        //     event.preventDefault();
        //     console.log("RIGHT CLICK");
        // });

    }, []);

    useEffect(() => {

        // console.log("Registering mouse move event...");

        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);

    // Navigation
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [mousePos, setMousePos] = useState({});
    const [productList, setProductList] = useState([]);
    // const [consumedProductsList, setConsumedProductsList] = useState([]);
    const [consumedProductsList_V2, setConsumedProductsList_V2] = useState({});
    const [priceBubbles, setPriceBubbles] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0);
    const [productCounter, setProductCounter] = useState(1);
    const [customerSittingTables, setCustomerSittingTables] = useState([]);
    const [selectedCSTinUI, setSelectedCSTinUI] = useState(null);
    const [selectedCSTinDB, setSelectedCSTinDB] = useState(null);
    const [cateringOrderIDinDB, setCateringOrderIDinDB] = useState("");
    const [COID, setCOID] = useState(0);
    const [kitchenOrderIssued, setKitchenOrderIssued] = useState(false);
    const [finalized, setFinalized] = useState(false);
    const [categories, setCategories] = useState([]);
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [paymentValidationWindowOpen, setPaymentValidationWindowOpen] = useState(false);
    const [addMiscProductPopupOpen, setAddMiscProductPopupOpen] = useState(false);
    const [customAmountPopupOpen, setCustomAmountPopupOpen] = useState(false);
    const [currentCustomAmountPopupTargetProduct, setCurrentCustomAmountPopupTargetProduct] = useState(null);

    // Normal
    const cstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-500 text-lg font-bold flex flex-col justify-center items-center';

    // Selected in UI
    const selectedCstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold flex flex-col justify-center items-center';

    // Selected in DB
    const occupiedCstStyle = 'inline m-1 p-1 text-gray-100 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold vfx-gradient-anim flex flex-col justify-center items-center';

    // Dim and disabled when another table is selected in DB
    const hiddenCstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg select-none bg-gray-500 text-lg font-bold opacity-20 flex flex-col justify-center items-center';

    // var updateCSTInterval;

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
                // console.log("CAT RESULT = " + JSON.stringify(res.data));
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
                // console.log("CO RESULT = " + JSON.stringify(res.data));
                // setConsumedProductsList(res.data.consumedProducts);
                // setConsumedProductsList_V2(res.data.consumedProducts);
                setConsumedProductsList_V2(res.data.consumedProducts);
                setCateringOrderIDinDB(res.data._id);
                setCOID(res.data.coid);
                setSelectedCSTinDB(res.data.customerSittingTableID);
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

    const handleProductOnClick = (e, ParamProduct) => {

        e.preventDefault();

        if (finalized)
            return;

        if (e.type === 'click') {
            // console.log('1 : Left click');
        } else if (e.type === 'contextmenu') {
            // console.log('1 : Right click');
            setCurrentCustomAmountPopupTargetProduct(ParamProduct);
            setCustomAmountPopupOpen(true);
            return;
        }

        let bubble = { key: productCounter, x: mousePos.x, y: mousePos.y, price: ParamProduct.price };
        setPriceBubbles(priceBubbles => [...priceBubbles, bubble]);

        setTimeout(() => { handleBubbleExpire(productCounter) }, 1000);

        let productInfo;
        if (consumedProductsList_V2[ParamProduct._id])
            productInfo = { key: ParamProduct._id, id: ParamProduct._id, name: ParamProduct.name, price: ParamProduct.price, altLangName: ParamProduct.altLangName, amount: consumedProductsList_V2[ParamProduct._id].amount + 1 };
        else
            productInfo = { key: ParamProduct._id, id: ParamProduct._id, name: ParamProduct.name, price: ParamProduct.price, altLangName: ParamProduct.altLangName, amount: 1 };

        let tmpObj_V2 = consumedProductsList_V2;
        tmpObj_V2[ParamProduct._id] = productInfo;
        setConsumedProductsList_V2(tmpObj_V2);

        setChangesAvailable(true);

        setProductCounter(productCounter + 1);
    }

    const handleBubbleExpire = (ParamProductKey) => {
        let bubble = priceBubbles.filter(b => b.key == ParamProductKey);
        setPriceBubbles(priceBubbles => priceBubbles.filter(b => b.key !== ParamProductKey));
    }

    const handleProductRemove = (ParamProduct) => {

        if (finalized)
            return;

        // console.log(ParamProduct.key);
        let tmpKeys = Object.keys(consumedProductsList_V2).filter((k) => {
            return k !== ParamProduct.key;
        });
        let result = {};
        tmpKeys.forEach(k => {
            result[k] = consumedProductsList_V2[k];
        });
        // var tmpArray = consumedProductsList_V2.filter(function (p) {
        //     return p.key !== ParamProduct.key;
        // });
        // setConsumedProductsList_V2(tmpArray);
        setConsumedProductsList_V2(result);
        setChangesAvailable(true);
    }

    const GetTotalPrice = () => {

        if (!consumedProductsList_V2)
            return 0;

        var total = 0;
        // consumedProductsList_V2.forEach(p => {
        //     total += p.price;
        // });
        for (const k in consumedProductsList_V2) {
            total += (consumedProductsList_V2[k].price * consumedProductsList_V2[k].amount);
        };
        return total;
    }

    const handleClearAllOnClick = () => {
        if (finalized)
            return;

        // setConsumedProductsList([]);
        setConsumedProductsList_V2({});
        setChangesAvailable(true);
    }

    const IssueCateringOrder = async () => {

        if (finalized)
            return;

        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, true, selectedCSTinUI, GetTotalPrice());

        // Mark table occupied
        if (selectedCSTinUI) {
            // setOccupiedCST(true);
            MarkCustomerSittingTableOccupiedInDB(selectedCSTinUI, cateringOrderIDinDB);
        }

        // ...
        setKitchenOrderIssued(true);

        // Print in kitchen
        const doc = await BuildKitchenPDF();
        await PrintKitchenPDF(doc);
    }

    const SaveOnClick = () => {
        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, kitchenOrderIssued, selectedCSTinUI, GetTotalPrice());
    }

    const OccupyCST = async () => {

        if (finalized || selectedCSTinDB)
            return;

        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, false, selectedCSTinUI, GetTotalPrice());

        // Mark table occupied
        if (selectedCSTinUI) {
            // setOccupiedCST(true);
            MarkCustomerSittingTableOccupiedInDB(selectedCSTinUI, cateringOrderIDinDB);
        }

        // ...
        // setKitchenOrderIssued(true);

        // Print in kitchen
        // const doc = await BuildKitchenPDF();
        // await PrintKitchenPDF(doc);
    }

    // const buildBatchedConsumedProductsArray = () => {
    //     var result = [];
    //     var arrayOfIDs = [];

    //     setConsumedProductsList_V2.forEach(p => {

    //         if (result[p.id]) {
    //             let me = result[p.id];
    //             result[p.id] = { name: me.name, amount: me.amount + 1, price: me.price, altLangName: me.altLangName };
    //         } else {
    //             result[p.id] = { name: p.name, amount: 1, price: p.price, altLangName: p.altLangName };
    //             arrayOfIDs.push(p.id);
    //         }

    //     });

    //     let finalResult = [];

    //     arrayOfIDs.forEach(id => {
    //         finalResult.push(result[id]);
    //     });

    //     // console.log("FINAL RESULT = " + JSON.stringify(finalResult));

    //     return finalResult;
    // }

    const buildConsumedProductsTableDataForPDF = (ParamKitchenMode) => {

        // let head = [['Panne', 'Prix Estimé']];
        // ParamKitchenMode : in kitchen mode don't send price and total price
        var head = ['Designation', 'Qte', 'P.U', 'Montant'];
        if (ParamKitchenMode)
            head = ['Designation', 'Qte', 'الإسم'];

        let body = [];

        if (ParamKitchenMode) {
            // ParamBatchedConsumedProducts.forEach(p => {
            //     let tableLine = [];
            //     tableLine.push(p.name);
            //     tableLine.push(p.amount);
            //     tableLine.push(p.altLangName);
            //     body.push(tableLine);
            // });
            for (const k in consumedProductsList_V2) {
                let tableLine = [];
                let p = consumedProductsList_V2[k];
                tableLine.push(p.name);
                tableLine.push(p.amount);
                tableLine.push(p.altLangName);
                body.push(tableLine);
            };
        }
        else {
            // ParamBatchedConsumedProducts.forEach(p => {
            //     let tableLine = [];
            //     tableLine.push(p.name);
            //     tableLine.push(p.amount);
            //     tableLine.push(p.price);
            //     tableLine.push(p.price * p.amount);
            //     body.push(tableLine);
            // });
            for (const k in consumedProductsList_V2) {
                let tableLine = [];
                let p = consumedProductsList_V2[k];
                tableLine.push(p.name);
                tableLine.push(p.amount);
                tableLine.push(p.price);
                tableLine.push(p.price * p.amount);
                body.push(tableLine);
            };
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
        // const products = buildBatchedConsumedProductsArray();
        const tableData = buildConsumedProductsTableDataForPDF(false);

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
        // const products = buildBatchedConsumedProductsArray();
        const tableData = buildConsumedProductsTableDataForPDF(true);

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

    const FinalizeCateringOrder = async (ParamPaymentAmount) => {

        if (finalized)
            return;

        console.log("Finalizing catering order, Payment = " + ParamPaymentAmount);

        // Print receipt
        PrintPDF();

        // Update in database
        if (selectedCSTinDB)
            MarkCustomerSittingTableFreeInDB(selectedCSTinDB);

        // Update in database
        FinalizeCateringOrderInDB(cateringOrderIDinDB, ParamPaymentAmount);

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

        if (res) {
            setChangesAvailable(false);
        }
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

        if (res) {
            setSelectedCSTinDB(ParamID);
        }

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

        if (res) {
            setSelectedCSTinDB(null);
        }

        GetCustomerSittingTablesListFromDb();
    }

    const FinalizeCateringOrderInDB = async (ParamID, ParamPaymentAmount) => {

        // let totalPriceCache = GetTotalPrice();
        let cateringOrderToPost = { id: ParamID, finalized: true, totalPrice: GetTotalPrice(), fulfilledPaiement: ParamPaymentAmount, consumedProducts: consumedProductsList_V2 };

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
            return occupiedCstStyle;
        else {
            if (selectedCSTinDB || finalized)
                return hiddenCstStyle;
            else if (ParamTableID == selectedCSTinUI)
                return selectedCstStyle;
            else
                return cstStyle;
        }
    }

    const handleCSTonClick = (ParamTable) => {
        if (ParamTable.occupied) {
            navigate("/sales-point?id=" + ParamTable.cateringOrder);
            navigate(0);
        } else if (!selectedCSTinDB) {
            setSelectedCSTinUI(ParamTable._id);
        }
    }

    const GetCustomerSittingTableLabelInPrint = () => {
        if (selectedCSTinDB) {
            var result = customerSittingTables.find(t => {
                return t._id == selectedCSTinDB;
            });


            if (result) {
                return "Table " + result.name;
            }
        }

        return "";
    }

    const paymentValidationWindowOnClose = () => {
        setPaymentValidationWindowOpen(false);
    }

    const addMiscProductPopupOnClose = () => {
        setAddMiscProductPopupOpen(false);
    }

    const AddMiscProduct = (ParamDesignation, ParamPrice, ParamAmout) => {
        let productInfo;
        if (consumedProductsList_V2[ParamDesignation])
            productInfo = { key: ParamDesignation, id: ParamDesignation, name: ParamDesignation, price: ParamPrice, altLangName: "", amount: consumedProductsList_V2[ParamDesignation].amount + ParamAmout };
        else
            productInfo = { key: ParamDesignation, id: ParamDesignation, name: ParamDesignation, price: ParamPrice, altLangName: "", amount: ParamAmout };

        let tmpObj_V2 = consumedProductsList_V2;
        tmpObj_V2[ParamDesignation] = productInfo;
        setConsumedProductsList_V2(tmpObj_V2);

        setChangesAvailable(true);

        setProductCounter(productCounter + 1);
    }

    const onCustomAmountPopupConfirm = (ParamAmout) => {
        let p = currentCustomAmountPopupTargetProduct;

        if (p == null)
            return;

        let productInfo;
        if (consumedProductsList_V2[p._id])
            productInfo = { key: p._id, id: p._id, name: p.name, price: p.price, altLangName: p.altLangName, amount: consumedProductsList_V2[p._id].amount + ParamAmout };
        else
            productInfo = { key: p._id, id: p._id, name: p.name, price: p.price, altLangName: p.altLangName, amount: ParamAmout };

        let tmpObj_V2 = consumedProductsList_V2;
        tmpObj_V2[p._id] = productInfo;
        setConsumedProductsList_V2(tmpObj_V2);

        setChangesAvailable(true);

        setProductCounter(productCounter + 1);
    }

    return (
        <div>
            <div className='fixed right-4 top-16 w-40 flex flex-col'>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized || !changesAvailable ? 'disabled' : 'primary'} onPress={SaveOnClick} before={<FaSave size={24} />}>Enregistrer</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : selectedCSTinDB ? 'disabled' : selectedCSTinUI ? 'primary' : 'disabled'} before={<FaChair size={24} />} onPress={OccupyCST}>Reserver</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : kitchenOrderIssued ? 'secondary' : 'primary'} onPress={IssueCateringOrder} before={<FaRegPaperPlane size={24} />}>Commande</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'primary'} onPress={() => setPaymentValidationWindowOpen(true)} before={<FaCheckCircle size={24} />}>Paiement</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'danger'} onPress={handleClearAllOnClick} before={<FaTrash size={24} />}>Effacer</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'primary'} onPress={() => setAddMiscProductPopupOpen(true)} before={<FaPizzaSlice size={24} />}>Divers</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type='primary' onPress={downloadPDFOnClick} before={<FaDownload size={24} />}>Télécharger</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type='primary' before={<FaPlus size={24} />}><a href={GetBaseUrl() + "/sales-point"}>Nouveau</a></AwesomeButton></div></div>
            </div>

            <div>
                {priceBubbles.map(b =>
                    <div key={b.key} style={{
                        backgroundColor: "white",
                        position: "fixed",
                        top: b.y - 16,
                        left: b.x,
                        padding: "4px",
                        border: "solid white 1px",
                        borderRadius: "16px",
                        zIndex: "20",
                        color: "black",
                        fontWeight: "600",
                        opacity: "0.7",
                        WebkitUserSelect: "none",
                        msUserSelect: "none",
                        userSelect: "none",
                        pointerEvents: "none"
                    }} className='vfx-fadeout-2s'>
                        + {b.price} DA
                    </div>
                )}
            </div>

            <CateringSalesPointPaymentPopup value={GetTotalPrice()} isOpen={paymentValidationWindowOpen} onClose={paymentValidationWindowOnClose} onConfirm={FinalizeCateringOrder} />
            <AddMiscProductPopup isOpen={addMiscProductPopupOpen} onClose={addMiscProductPopupOnClose} onConfirm={AddMiscProduct} />
            <CustomAmountPopup isOpen={customAmountPopupOpen} onClose={() => setCustomAmountPopupOpen(false)} onConfirm={onCustomAmountPopupConfirm} />

            {/* CST */}
            <div className='fixed h-28 bg-gray-900 rounded-xl left-2 text-gray-100 border-2 border-gray-100 right-48 z-10 top-16'>
                <div className='flex flex-wrap overflow-auto scrollbar h-24 m-1'>
                    {customerSittingTables.map(t => <p key={t._id} className={getCustomerSittingTableStyle(t.occupied, t._id)} onClick={() => handleCSTonClick(t)}>Table {t.name}</p>)}
                </div>
            </div>

            {/* Catering Order Info */}
            <div className='fixed h-12 bg-gray-900 rounded-xl left-2 text-gray-100 border-2 border-gray-100 right-48 top-44 z-10 grid grid-cols-3'>
                <div className='bg-gray-700 rounded-xl m-1 mr-0 text-lg font-bold pt-0.5'>Commande N° : {COID}</div>
                <div className='bg-gray-700 rounded-xl m-1 text-lg font-bold pt-0.5'>{selectedCSTinDB ? GetCustomerSittingTableLabelInPrint() : "Aucune Table"}</div>
                <div className='bg-gray-700 rounded-xl m-1 ml-0 text-lg font-bold pt-0.5'>Prix Total : {GetTotalPrice()} DA</div>
            </div>

            {/* Consumed Products */}
            <div className='fixed h-28 bg-gray-900 rounded-xl text-gray-100 py-2 border-2 border-gray-100 right-48 left-2 z-10 top-56 overflow-auto scrollbar'>
                <div className='flex flex-wrap'>
                    {/* {consumedProductsList.length >= 1 ? consumedProductsList.map(p => <p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={p.key} onClick={() => handleProductRemove(p)}>{p.name}</p>) : <p className='flex items-center justify-center text-gray-300 h-20 w-full'>Aucun produit séléctionner...</p>} */}
                    {/* {Object.keys(consumedProductsList_V2).map((keyName, i)=>(<p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={consumedProductsList_V2[keyName].key} onClick={() => handleProductRemove(consumedProductsList_V2[keyName])}>{consumedProductsList_V2[keyName].name}</p>))} */}
                    {(consumedProductsList_V2 && Object.keys(consumedProductsList_V2).length >= 1) ? Object.keys(consumedProductsList_V2).map((keyName, i) => (<ConsumedProductTag key={keyName} value={consumedProductsList_V2[keyName]} onClick={() => handleProductRemove(consumedProductsList_V2[keyName])} />)) : <p className='flex items-center justify-center text-gray-300 h-20 w-full'>Aucun produit séléctionner...</p>}
                </div>
            </div>

            <div className='mt-72'>
                {/* Categorized Products */}
                {
                    categories.map(cat =>
                        <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2' key={cat._id}>
                            <p className='w-full text-xl font-bold text-gray-100 bg-gray-700'>{cat.name}</p><br />
                            <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48'>
                                {productList.map(p => p.category == cat._id && <NetImage value={p} key={p._id} size={32} onClick={(e) => handleProductOnClick(e, p)} onContextMenu={(e) => handleProductOnClick(e, p)} />)}
                            </div>
                            <br />
                            <br />
                        </div>
                    )
                }

                {/* Non-Categorized Products */}
                <div className='flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2'>
                    <p className='w-full text-xl font-bold text-gray-100 bg-gray-700'>Divers</p><br />
                    {productList.map(p => p.category == "NULL" && <NetImage value={p} key={p._id} size={32} onClick={(e) => handleProductOnClick(e, p)} onContextMenu={(e) => handleProductOnClick(e, p)} />)}
                    <br />
                    <br />
                </div>

            </div>

        </div>


    )
}

export default CateringSalesPoint