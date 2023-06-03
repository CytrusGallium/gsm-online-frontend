import { React, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaRegPaperPlane, FaTrash, FaCheckCircle, FaDownload, FaPlus, FaChair, FaSave, FaPizzaSlice, FaShoppingBag } from 'react-icons/fa';
import NetImage from '../components/NetImage';
import MMSSCountdown from '../components/MMSSCountDown';
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
import { DottedLine } from '../Reaknotron/Libs/RknPdfLibs';
import GenericMessagePopup from '../components/GenericMessagePopup';
// import RknPopup from '../components/RknUI/RknPopup';
const jspdf = require('jspdf');

const CateringSalesPoint = () => {

    // Effect 1
    useEffect(() => {

        // console.log("BASE URL = " + GetBaseUrl());

        if (searchParams.get("id")) {
            GetCateringOrderFromDB(searchParams.get("id"));
        }
        else {
            GenerateNewCateringOrder();
        }

        GetCustomerSittingTablesListFromDb();
        GetProductListFromDb();
        GetTakeOutOrdersListFromDb();

    }, []);

    // Effect 2
    useEffect(() => {

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
    const [consumedProductsList_V2, setConsumedProductsList_V2] = useState({});
    const [priceBubbles, setPriceBubbles] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0);
    const [productCounter, setProductCounter] = useState(1);
    const [customerSittingTables, setCustomerSittingTables] = useState([]);
    const [takeoutOrders, setTakeoutOrders] = useState([]);
    const [selectedCSTinUI, setSelectedCSTinUI] = useState(null);
    const [selectedCSTinDB, setSelectedCSTinDB] = useState(null);
    const [cateringOrderIDinDB, setCateringOrderIDinDB] = useState("");
    const [COID, setCOID] = useState(0);
    const [kitchenOrderIssued, setKitchenOrderIssued] = useState(false);
    const [finalized, setFinalized] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryPresenceCheck, setCategoryPresenceCheck] = useState({});
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [paymentValidationWindowOpen, setPaymentValidationWindowOpen] = useState(false);
    const [addMiscProductPopupOpen, setAddMiscProductPopupOpen] = useState(false);
    const [customAmountPopupOpen, setCustomAmountPopupOpen] = useState(false);
    const [currentCustomAmountPopupTargetProduct, setCurrentCustomAmountPopupTargetProduct] = useState(null);
    const [priceDiffInfo, setpriceDiffInfo] = useState(null);
    const [errorPopupOpen, setErrorPopupOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState("");

    // Normal
    const cstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-500 text-lg font-bold flex flex-col justify-center items-center';

    // Selected in UI
    const selectedCstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold flex flex-col justify-center items-center';

    // Selected in DB
    const occupiedCstStyle = 'inline m-1 p-1 text-gray-100 rounded-lg cursor-pointer select-none bg-gray-100 text-lg font-bold vfx-gradient-anim flex flex-col justify-center items-center';

    // Dim and disabled when another table is selected in DB
    const hiddenCstStyle = 'inline m-1 p-1 text-gray-900 rounded-lg select-none bg-gray-500 text-lg font-bold opacity-20 flex flex-col justify-center items-center';

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list?sellable=true&ignoreDeleted=true";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log(JSON.stringify(res.data));
                // this.setState({ isBusy: false });
                setProductList(res.data);

                // Check present categories
                let tmpCategoryPresenceCheck = {};
                res.data.forEach((p) => {
                    tmpCategoryPresenceCheck[p.category] = true;
                });
                setCategoryPresenceCheck(tmpCategoryPresenceCheck);

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

                if (res.data.consumedProducts)
                    setConsumedProductsList_V2(res.data.consumedProducts);

                setCateringOrderIDinDB(res.data._id);
                setCOID(res.data.coid);
                setSelectedCSTinDB(res.data.customerSittingTableID);
                setKitchenOrderIssued(res.data.kitchenOrderIssued);
                setFinalized(res.data.finalized);

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

    const GetTakeOutOrdersListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-active-takeout-order-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                // console.log("RESULT = " + JSON.stringify(res.data));
                // this.setState({ isBusy: false });

                // setTakeoutOrders(res.data);

                // Build ID, COID, Duration...etc array
                let tmpArray = [];
                let lastReadyTime = null;
                let timeBuildUp = 0;

                res.data.forEach((o) => {

                    let kot = new Date(o.kitchenOrderTime);
                    let readyTime;

                    if (lastReadyTime && kot < lastReadyTime) {
                        timeBuildUp += Math.abs(lastReadyTime.getTime() - kot.getTime());
                        readyTime = new Date(kot.getTime() + (o.preparationDuration * 60000) + timeBuildUp);
                    } else if (lastReadyTime && kot > lastReadyTime) {
                        timeBuildUp = 0;
                        readyTime = new Date(kot.getTime() + o.preparationDuration * 60000);
                        lastReadyTime = readyTime;
                    } else {
                        readyTime = new Date(kot.getTime() + o.preparationDuration * 60000);
                        lastReadyTime = readyTime;
                    }

                    tmpArray.push({
                        _id: o._id,
                        coid: o.coid,
                        preparationDuration: o.preparationDuration,
                        kitchenOrderTime: kot,
                        readyTime: readyTime
                    });
                })

                setTakeoutOrders(tmpArray);
                // console.log("ATO = " + JSON.stringify(tmpArray));
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
                navigate('/catering-sales-point?id=' + res.data._id);
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

        // console.log("Duration = " + ParamProduct.preparationDuration);

        if (e.type === 'click') {
            // console.log('1 : Left click');
        } else if (e.type === 'contextmenu') {
            // console.log('2 : Right click');
            setCurrentCustomAmountPopupTargetProduct(ParamProduct);
            setCustomAmountPopupOpen(true);
            return;
        }

        let bubble = { key: productCounter, x: mousePos.x, y: mousePos.y, price: ParamProduct.price };
        setPriceBubbles(priceBubbles => [...priceBubbles, bubble]);

        setTimeout(() => { handleBubbleExpire(productCounter) }, 1000);

        let productInfo;
        if (consumedProductsList_V2[ParamProduct._id]) {
            productInfo = { key: ParamProduct._id, id: ParamProduct._id, name: ParamProduct.name, category: ParamProduct.category, price: ParamProduct.price, altLangName: ParamProduct.altLangName, amount: consumedProductsList_V2[ParamProduct._id].amount + 1, preparationDuration: ParamProduct.preparationDuration };
        }
        else {
            productInfo = { key: ParamProduct._id, id: ParamProduct._id, name: ParamProduct.name, category: ParamProduct.category, price: ParamProduct.price, altLangName: ParamProduct.altLangName, amount: 1, preparationDuration: ParamProduct.preparationDuration };
        }

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

        let tmpKeys = Object.keys(consumedProductsList_V2).filter((k) => {
            return k !== ParamProduct.key;
        });

        let result = {};
        tmpKeys.forEach(k => {
            result[k] = consumedProductsList_V2[k];
        });

        setConsumedProductsList_V2(result);
        setChangesAvailable(true);
    }

    const GetTotalPrice = () => {

        if (!consumedProductsList_V2)
            return 0;

        var total = 0;

        for (const k in consumedProductsList_V2) {
            total += (consumedProductsList_V2[k].price * consumedProductsList_V2[k].amount);
        };

        return total;
    }

    const GetTotalPreparationDuration = () => {

        if (!consumedProductsList_V2)
            return 0;

        let sameProdPrepTimeModifier = 0.2;
        let sameCatPrepTimeModifier = 0.5;

        if (localStorage.getItem("sameProdPrepTimeModifier")) {
            sameProdPrepTimeModifier = localStorage.getItem("sameProdPrepTimeModifier");
        }

        if (localStorage.getItem("sameCatPrepTimeModifier")) {
            sameCatPrepTimeModifier = localStorage.getItem("sameCatPrepTimeModifier");
        }

        var total = 0;
        var tmpCategories = [];

        for (const k in consumedProductsList_V2) {

            let cp = consumedProductsList_V2[k];
            let categoryModifier = 1;

            if (cp.preparationDuration) {

                if (cp.category) {
                    if (tmpCategories.includes(cp.category))
                        categoryModifier = sameCatPrepTimeModifier;
                    else
                        tmpCategories.push(cp.category);
                }

                const amount = cp.amount;
                if (amount > 1) {
                    const batchableAmount = amount - 1;
                    total += cp.preparationDuration;
                    total += (cp.preparationDuration * batchableAmount * sameProdPrepTimeModifier);
                } else {
                    total += (cp.preparationDuration * cp.amount * categoryModifier);
                }
            }
        };

        return total;
    }

    const handleClearAllOnClick = () => {
        if (finalized)
            return;

        setConsumedProductsList_V2({});
        setChangesAvailable(true);
    }

    const IssueCateringOrder = async () => {

        if (finalized)
            return;

        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, true, selectedCSTinUI, GetTotalPrice(), GetTotalPreparationDuration());

        // Mark table occupied
        if (selectedCSTinUI) {
            MarkCustomerSittingTableOccupiedInDB(selectedCSTinUI, cateringOrderIDinDB);
        }

        // ...
        setKitchenOrderIssued(true);

        // Print in kitchen
        const doc_1 = await BuildKitchenPDF();
        PrintKitchenPDF(doc_1);

        // Print waiting ticket for takeout orders
        console.log("PRE-PRINT");
        if (selectedCSTinDB == null) {
            console.log("ON-PRINT");
            const doc_2 = await BuildWaitingTicketPDF();
            PrintWaitingTicketPDF(doc_2);
        }
    }

    const SaveOnClick = () => {

        if (!changesAvailable)
            return;

        // Update in DB
        UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, kitchenOrderIssued, selectedCSTinUI, GetTotalPrice());
    }

    const OccupyCST = async () => {

        if (finalized || selectedCSTinDB)
            return;

        if (selectedCSTinUI) {
            // Update in DB
            UpdateCateringOrderInDB(cateringOrderIDinDB, consumedProductsList_V2, false, selectedCSTinUI, GetTotalPrice());
            // Mark table occupied
            MarkCustomerSittingTableOccupiedInDB(selectedCSTinUI, cateringOrderIDinDB);
            // Get up to date list of takeout orders
            GetTakeOutOrdersListFromDb();
        }
    }

    const buildConsumedProductsTableDataForPDF = (ParamKitchenMode) => {

        var head = ['Designation', 'Qte', 'P.U', 'Montant'];
        if (ParamKitchenMode)
            head = ['Designation', 'Qte', 'الإسم'];

        let body = [];

        if (ParamKitchenMode) {
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

    const BuildPDF = async (ParamPriceDiffInfo = null) => {

        var receiptWidth = 60;

        if (localStorage.getItem("receiptWidth")) {
            receiptWidth = Number(localStorage.getItem("receiptWidth"));
            console.log("RECEIPT WIDTH = " + receiptWidth);
        }

        const halfReceiptWidth = receiptWidth / 2;

        const doc = new jspdf.jsPDF('p', 'mm', [192, receiptWidth]); // Portrait, Milimeter, Height, Width
        var cursorY = 20;

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
        doc.text(GetShortDate(), 3, cursorY, 'left');

        // Time
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(GetTimeHM2Digits(), receiptWidth - 3, cursorY, 'right');
        cursorY += 1;

        // Consumption table
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

        console.log("Param Price Diff Info = " + JSON.stringify(ParamPriceDiffInfo));
        let diff = 0;
        // Discount / Extra Fees
        if (ParamPriceDiffInfo) {
            console.log("Param Price Diff Info FOUND");
            if (ParamPriceDiffInfo.isDiff && ParamPriceDiffInfo.diff) {
                diff = ParamPriceDiffInfo.diff;
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.text(ParamPriceDiffInfo.label + " " + ParamPriceDiffInfo.amountLabel + " DA", halfReceiptWidth, cursorY, 'center');
                cursorY += 5;
                doc.setFont(undefined, 'normal');
            }
        }
        else if (priceDiffInfo && priceDiffInfo.isDiff && priceDiffInfo.show) {
            diff = priceDiffInfo.diff;
            console.log("Price Diff Info FOUND");
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(priceDiffInfo.label + " " + priceDiffInfo.amountLabel + " DA", halfReceiptWidth, cursorY, 'center');
            cursorY += 5;
            doc.setFont(undefined, 'normal');
        }

        // Total
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);

        if (diff)
            doc.text("Total à Payer : " + (GetTotalPrice() + diff) + " DA", halfReceiptWidth, cursorY, 'center');
        else
            doc.text("Total à Payer : " + GetTotalPrice() + " DA", halfReceiptWidth, cursorY, 'center');

        cursorY += 5;
        doc.setFont(undefined, 'normal');

        // Line
        DottedLine(doc, 1, cursorY, receiptWidth - 1, cursorY, 1);
        cursorY += 3;

        doc.setFont(undefined, 'bold');
        doc.setFontSize(7);
        doc.text("Adresse : En face Center de formation, Imama", halfReceiptWidth, cursorY, 'center');
        cursorY += 3;
        doc.text("Téléphone : 05 40 95 13 17", halfReceiptWidth, cursorY, 'center');
        cursorY += 1;
        doc.setFont(undefined, 'normal');

        DottedLine(doc, 1, cursorY, receiptWidth - 1, cursorY, 1);
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
            cursorY += 10;
            doc.setFont(undefined, 'normal');
        }
        else {
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text("• A Emporter •", halfReceiptWidth, cursorY, 'center');
            cursorY += 9;
            doc.setFont(undefined, 'normal');
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
        const tableData = buildConsumedProductsTableDataForPDF(true);

        const samimBinary = SamimBold_GetBinaryString();
        doc.addFileToVFS('samim', samimBinary);
        doc.addFont('samim', 'samim', 'normal');

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

    const BuildWaitingTicketPDF = async () => {

        var receiptWidth = 60;

        if (localStorage.getItem("receiptWidth")) {
            receiptWidth = Number(localStorage.getItem("receiptWidth"));
        }

        const halfReceiptWidth = receiptWidth / 2;

        const doc = new jspdf.jsPDF('p', 'mm', [192, receiptWidth]); // Portrait, Milimeter, Height, Width
        var cursorY = 5;

        // N°
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Commande à emporter N° " + COID, halfReceiptWidth, cursorY, 'center');
        cursorY += 7;
        doc.setFont(undefined, 'normal');

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
        doc.setFontSize(12);

        doc.text("Total à Payer : " + GetTotalPrice() + " DA", halfReceiptWidth, cursorY, 'center');

        cursorY += 4;
        doc.setFont(undefined, 'normal');

        // Note
        doc.setFont(undefined, 'bold');
        doc.setFontSize(7);
        doc.text("veuillez patienter...", halfReceiptWidth, cursorY, 'center');
        cursorY += 3;
        doc.setFont(undefined, 'normal');

        return doc;
    }

    const FinalizeCateringOrder = async (ParamPaymentAmount, ParamPriceDiffInfo) => {

        if (finalized)
            return;

        console.log("Finalizing catering order, Payment = " + ParamPaymentAmount);

        setpriceDiffInfo(ParamPriceDiffInfo);

        // Print receipt
        PrintPDF(ParamPriceDiffInfo);

        // Update in database
        if (selectedCSTinDB)
            MarkCustomerSittingTableFreeInDB(selectedCSTinDB);

        // Update in database
        FinalizeCateringOrderInDB(cateringOrderIDinDB, ParamPaymentAmount);

        // ...
        setFinalized(true);
    }

    const PrintPDF = async (ParamPriceDiffInfo = null) => {

        // Build PDF
        const doc = await BuildPDF(ParamPriceDiffInfo);

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

    const PrintWaitingTicketPDF = async (ParamPDF) => {

        const doc = ParamPDF;

        // Build form
        const formData = new FormData();
        formData.append("pdf", doc.output('blob'));

        const url = GetPrintServerAddress() + "?printer=" + GetPrinterName();
        console.log("POST : " + url);

        // Build Req/Res
        const response = await axios({
            method: "post",
            url: url,
            data: formData
        }, {}, () => console.log("CALLBACK"));
    }

    const UpdateCateringOrderInDB = async (ParamID, ParamConsumedProducts, ParamKitchenOrderIssued, ParamTableID, ParamTotalPrice, ParamPreparationDuration) => {

        let cateringOrderToPost = {
            id: ParamID,
            consumedProducts: ParamConsumedProducts,
            kitchenOrderIssued: ParamKitchenOrderIssued,
            customerSittingTableID: ParamTableID,
            totalPrice: ParamTotalPrice,
            preparationDuration: ParamPreparationDuration
        };

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
            GetTakeOutOrdersListFromDb();
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

            // console.log("OCST R = " + res.data);
            if (res.data == "OK")
                setSelectedCSTinDB(ParamID);
            else if (res.data == "ALREADY_OCCUPIED") {
                console.log("Table already occupied !");
                setErrorPopupMessage("La Table est déja occupée...");
                setErrorPopupOpen(true);
            }
            else {
                console.log("Unknown error while trying to occupy table...");
                setErrorPopupMessage("Unknown error while trying to occupy table...");
                setErrorPopupOpen(true);
            }
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
            GetTakeOutOrdersListFromDb();
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

        if (res) {
            GetCustomerSittingTablesListFromDb();
            GetTakeOutOrdersListFromDb();
        }
    }

    const downloadPDFOnClick = async () => {
        const docCheckout = await BuildPDF();
        docCheckout.save("Bon-Dar-Mima.pdf");

        const docKitchen = await BuildKitchenPDF();
        docKitchen.save("Bon-Dar-Mima-Cuisine.pdf");

        const docWaitingTicket = await BuildWaitingTicketPDF();
        docWaitingTicket.save("Tiquet-Dar-Mima.pdf");
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
            navigate("/catering-sales-point?id=" + ParamTable.cateringOrder);
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
            productInfo = { key: ParamDesignation, id: ParamDesignation, name: ParamDesignation, price: ParamPrice, altLangName: "", custom: true, amount: consumedProductsList_V2[ParamDesignation].amount + ParamAmout };
        else
            productInfo = { key: ParamDesignation, id: ParamDesignation, name: ParamDesignation, price: ParamPrice, altLangName: "", custom: true, amount: ParamAmout };

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
            {/* Fixed Control Buttons */}
            <div className='fixed right-0 top-16 w-44 bg-gray-800 border-l-2 border-gray-500 bottom-0 px-1 flex flex-col'>
                <div className='mt-0 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized || !changesAvailable ? 'disabled' : 'primary'} onPress={SaveOnClick} before={<FaSave size={24} />}>Enregistrer</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : selectedCSTinDB ? 'disabled' : selectedCSTinUI ? 'primary' : 'disabled'} before={<FaChair size={24} />} onPress={OccupyCST}>Reserver</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : kitchenOrderIssued ? 'secondary' : 'primary'} onPress={IssueCateringOrder} before={<FaRegPaperPlane size={24} />}>Commande</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'primary'} onPress={() => !finalized && setPaymentValidationWindowOpen(true)} before={<FaCheckCircle size={24} />}>Paiement</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'danger'} onPress={handleClearAllOnClick} before={<FaTrash size={24} />}>Effacer</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type={finalized ? 'disabled' : 'primary'} onPress={() => !finalized && setAddMiscProductPopupOpen(true)} before={<FaPizzaSlice size={24} />}>Divers</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type='primary' onPress={downloadPDFOnClick} before={<FaDownload size={24} />}>Télécharger</AwesomeButton></div></div>
                <div className='mt-1 h-12 cursor-pointer'><div className='mt-2'><AwesomeButton className='w-full' type='primary' before={<FaPlus size={24} />}><a href={GetBaseUrl() + "/catering-sales-point"}>Nouveau</a></AwesomeButton></div></div>

                {/* Takeout Orders */}
                <div className='mt-3 h-7 bg-gray-800 rounded-t-xl border border-gray-500 text-gray-300 font-bold text-xs pt-1'>Commandes à emporter</div>
                <div className='h-40 cursor-pointer grow bg-gray-700 mb-1 flex flex-col overflow-auto scrollbar rounded-b-xl border border-gray-500'>
                    {takeoutOrders.map(t =>
                        <a key={t._id} className='inline m-1 p-1 text-gray-900 rounded-lg cursor-pointer select-none bg-gray-500 text-lg font-bold flex flex-col justify-center items-center h-12 hover:bg-gray-900 hover:text-gray-100 duration-150' href={GetBaseUrl() + "/catering-sales-point?id=" + t._id}>
                            <div className='flex flex-row'>
                                <FaShoppingBag className='inline mt-1 mx-1' />
                                {/* <span>{t.coid + " (" + t.readyAt.getHours() + ":" + t.readyAt.getMinutes() + ")"}</span> */}
                                {/* <span>{t.coid + " (" + t.readyAt.getHours() + ":" + t.readyAt.getMinutes() + ")"}</span> */}
                                <span className='mr-2'>{t.coid}</span>
                                <MMSSCountdown date={t.readyTime} />
                            </div>
                        </a>)}
                </div>
            </div>

            {/* Price Bubbles */}
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

            {/* Popups */}
            <CateringSalesPointPaymentPopup value={GetTotalPrice()} isOpen={paymentValidationWindowOpen} onClose={paymentValidationWindowOnClose} onConfirm={FinalizeCateringOrder} />
            <AddMiscProductPopup isOpen={addMiscProductPopupOpen} onClose={addMiscProductPopupOnClose} onConfirm={AddMiscProduct} />
            <CustomAmountPopup isOpen={customAmountPopupOpen} onClose={() => setCustomAmountPopupOpen(false)} onConfirm={onCustomAmountPopupConfirm} />
            <GenericMessagePopup isOpen={errorPopupOpen} onClose={() => setErrorPopupOpen(false)} message={errorPopupMessage} closeButton={true} sad={true} />

            {/* CST */}
            <div className='fixed h-28 bg-gray-900 rounded-xl left-2 text-gray-100 border-2 border-gray-100 right-48 z-10 top-16'>
                <div className='flex flex-wrap overflow-auto scrollbar h-24 m-1'>
                    {customerSittingTables.map(t => <p key={t._id} className={getCustomerSittingTableStyle(t.occupied, t._id)} onClick={() => handleCSTonClick(t)}>Table {t.name}</p>)}
                </div>
            </div>

            {/* Catering Order Info */}
            <div className='fixed h-12 bg-gray-900 rounded-xl left-2 text-gray-800 border-2 border-gray-100 right-48 top-44 z-10 grid grid-cols-4'>
                <div className='bg-white rounded-xl m-1 mr-0 text-lg font-bold pt-0.5'>Commande N° : {COID}</div>
                <div className='bg-white rounded-xl m-1 mr-0.5 text-lg font-bold pt-0.5'>{selectedCSTinDB ? GetCustomerSittingTableLabelInPrint() : "Aucune Table"}</div>
                <div className='bg-white rounded-xl m-1 ml-0.5 text-lg font-bold pt-0.5'>{GetTotalPreparationDuration() + " Minutes"}</div>
                <div className='bg-white rounded-xl m-1 ml-0 text-lg font-bold pt-0.5'>Prix Total : {GetTotalPrice()} DA</div>
            </div>

            {/* Consumed Products */}
            <div className='fixed h-28 bg-gray-900 rounded-xl text-gray-100 py-2 border-2 border-gray-100 right-48 left-2 z-10 top-56 overflow-auto scrollbar'>
                <div className='flex flex-wrap'>
                    {/* {consumedProductsList.length >= 1 ? consumedProductsList.map(p => <p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={p.key} onClick={() => handleProductRemove(p)}>{p.name}</p>) : <p className='flex items-center justify-center text-gray-300 h-20 w-full'>Aucun produit séléctionner...</p>} */}
                    {/* {Object.keys(consumedProductsList_V2).map((keyName, i)=>(<p className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' key={consumedProductsList_V2[keyName].key} onClick={() => handleProductRemove(consumedProductsList_V2[keyName])}>{consumedProductsList_V2[keyName].name}</p>))} */}
                    {(consumedProductsList_V2 && Object.keys(consumedProductsList_V2).length >= 1) ? Object.keys(consumedProductsList_V2).map((keyName, i) => (<ConsumedProductTag key={keyName} value={consumedProductsList_V2[keyName]} onClick={() => handleProductRemove(consumedProductsList_V2[keyName])} />)) : <p className='flex items-center justify-center text-gray-300 h-20 w-full'>Aucun produit séléctionner...</p>}
                </div>
            </div>

            <div className='mt-80'>

                <br />

                {/* Categorized Products */}
                {
                    categories.map(cat =>
                        <div className={'flex flex-wrap bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2' + (categoryPresenceCheck[cat._id] ? "" : " hidden")} key={cat._id}>
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
                <div className='bg-gray-800 pb-16 ml-4 rounded-3xl mr-48 my-2'>
                    <div className='w-full text-xl font-bold text-gray-100 bg-gray-700'>Divers</div>
                    <div className='flex flex-wrap'>
                        {productList.map(p => p.category === "" && <NetImage value={p} key={p._id} size={32} onClick={(e) => handleProductOnClick(e, p)} onContextMenu={(e) => handleProductOnClick(e, p)} />)}
                    </div>
                    <br />
                    <br />
                </div>

            </div>

        </div>


    )
}

export default CateringSalesPoint