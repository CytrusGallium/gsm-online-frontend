import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { useHotkeys } from 'react-hotkeys-hook';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { AwesomeButton } from 'react-awesome-button';
import { FaPrint, FaDownload, FaCheckCircle, FaList, FaSave } from 'react-icons/fa';
import '../ScrollBar.css';
import MizzappChoicePanel from '../components/MizzappChoicePanel';
import { motion } from "framer-motion";

const SalesPoint = () => {

    // {"1":"Tomato","10":"Lettuce","2":"Red Ognion","3":"Ognion","4":"Orange","5":"Potato","6":"Lemon","7":"White Potato","8":"Banana","9":"Apple","EVENT":"RESULT","WEIGHT":"7"}{"EVENT":"RESET"}{"1":"Orange","10":"Banana","2":"Red Ognion","3":"Lemon","4":"Tomato","5":"Apple","6":"Lettuce","7":"White Potato","8":"Ognion","9":"Potato","EVENT":"RESULT","WEIGHT":"?"}{"EVENT":"RESET"}{"1":"Tomato","10":"Lettuce","2":"Red Ognion","3":"Ognion","4":"Orange","5":"Potato","6":"Lemon","7":"White Potato","8":"Banana","9":"Apple","EVENT":"RESULT","WEIGHT":"7"}

    // const UpdateTotal = () => {
    //     setTotal(total + 100);
    // }

    const ref = useRef(null);

    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState({});
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [onError, setOnError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");
    const [displayMessage, setDisplayMessage] = useState("");
    // const [mizzapResult, setMizzapResult] = useState({"1":"Red Ognion","10":"Lettuce","2":"Tomato","3":"Ognion","4":"Orange","5":"Potato","6":"Lemon","7":"White Potato","8":"Banana","9":"Apple"});
    const [mizzappResult, setMizzappResult] = useState(null);
    const [mizzapWeight, setMizzapWeight] = useState(0);

    // useHotkeys('u', UpdateTotal, [total]);

    const MockMizzapResults = () => {
        const mock = { "1": "Red Ognion", "10": "Lettuce", "2": "Tomato", "3": "Ognion", "4": "Orange", "5": "Potato", "6": "Lemon", "7": "White Potato", "8": "Banana", "9": "Apple" };
        setMizzappResult(mock);
        setMizzapWeight(777);
    }

    useHotkeys('m', MockMizzapResults, [mizzappResult]);

    const AddMizzapResult = (ParamResultID) => {
        if (mizzappResult) {
            console.log("Searching for : " + mizzappResult[ParamResultID]);
            PerformGetRequest("/api/get-product?mizzappID=" + mizzappResult[ParamResultID], OnMizzappProductFound);
        }
    }

    useHotkeys('1', () => { AddMizzapResult("1") }, [mizzappResult]);
    useHotkeys('2', () => { AddMizzapResult("2") }, [mizzappResult]);
    useHotkeys('3', () => { AddMizzapResult("3") }, [mizzappResult]);

    useEffect(() => {
        const timeOutId = setTimeout(() => PerformGetRequest("/api/get-product?barcode=" + query, OnProductFound), 400);
        return () => clearTimeout(timeOutId);
    }, [query]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:44444');

        socket.addEventListener('open', () => {
            console.log('connected!');
            socket.send('Hello, server!');
        });

        socket.addEventListener('message', (event) => {
            setMessage(event.data);
            console.log("WS MSG = " + event.data);
            const obj = JSON.parse(event.data);

            if (obj.EVENT === "RESET")
                setMizzappResult(null);
            else if (obj.EVENT === "RESULT") {
                setMizzappResult(obj);

                if (obj.WEIGHT)
                    setMizzapWeight(obj.WEIGHT);
            }
            else if (obj.EVENT === "WEIGHT") {
                // setMizzappResult(obj);

                if (obj.WEIGHT)
                    setMizzapWeight(Number(obj.WEIGHT));
            }
            else
                setMizzappResult(null);

        });

        socket.addEventListener('error', (error) => {
            console.log(error);
            socket.close();
        });
    }, []);

    const PerformGetRequest = async (ParamRoute, ParamCallBack) => {

        // Parameters
        // ParamRoute Example : "/api/get-catering-orders-list"

        // Build Request
        var url = GetBackEndUrl() + ParamRoute;

        // Log Request
        console.log("GET : " + url);

        // Perform Request
        try {
            const res = await axios.get(url);
            if (res && ParamCallBack) {
                ParamCallBack(res);
            }
        } catch (error) {
            console.log("GET ERROR : " + error);
        }
    }

    const OnProductFound = (ParamResult) => {
        // console.log(ParamResult.data);
        if (ParamResult.data) {

            var tmp = products;

            if (tmp[ParamResult.data._id]) {
                tmp[ParamResult.data._id].amount += 1;
            } else {
                tmp[ParamResult.data._id] = ParamResult.data;
                tmp[ParamResult.data._id].amount = 1;
            }

            setProducts(tmp);
            setTotal(total + ParamResult.data.price);
            setChangesAvailable(true);
            setCount(count + 1);
            setQuery('');
            ref.current.focus();
        } else {
            // setDisplayMessage("NOT FOUND");
        }
    }

    const OnMizzappProductFound = (ParamResult) => {
        console.log("Result = " + JSON.stringify(ParamResult.data));
        if (ParamResult.data) {

            var tmp = products;

            if (tmp[ParamResult.data._id]) {
                tmp[ParamResult.data._id].amount += mizzapWeight;
            } else {
                tmp[ParamResult.data._id] = ParamResult.data;
                tmp[ParamResult.data._id].amount = mizzapWeight;
            }

            setProducts(tmp);
            setTotal(total + ParamResult.data.price);
            setChangesAvailable(true);
            setMizzappResult(null);
            setQuery('');
            setCount(count + 1);
            ref.current.focus();
        } else {
            // setDisplayMessage("NOT FOUND");
        }
    }

    const SaveAndPrint = () => {

    }

    const DownloadPDF = () => {

    }

    const PrintPDF = () => {

    }

    const Save = async () => {

        if (!changesAvailable)
            return;

        setIsSaving(true);

        let res;

        try {

            const url = GetBackEndUrl() + "/api/update-repair-order";
            res = await axios.post(url, products);

            if (res) {
                changesAvailable = false;
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

    return (
        <div className='text-gray-100'>
            <br />

            {/* Toolbar */}
            <motion.div
                className='fixed h-16 bg-gray-900 backdrop-blur bg-opacity-50 top-20 left-2 right-2 z-10 rounded-xl border-2 border-gray-500 flex flex-row items-center justify-center'
                initial={{ opacity: 0, y: "-25%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay : 0.1 }}
            >
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={Save} before={<FaSave size={24} />}><p className='hidden sm:block'>Enregistrer</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={'primary'} onPress={PrintPDF} before={<FaPrint size={24} />}><p className='hidden sm:block'>Imprimer le Bon</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type={changesAvailable ? 'primary' : 'disabled'} onPress={SaveAndPrint} before={<FaCheckCircle size={24} />}><p className='hidden sm:block'>Enregistrer & Imprimer (F1)</p></AwesomeButton>
                <span className='mx-1' />
                <AwesomeButton type='primary' onPress={DownloadPDF} before={<FaDownload size={24} />}><p className='hidden sm:block'>Télécharger le Bon</p></AwesomeButton>
                <span className='mx-1' />
            </motion.div>

            <br />
            <br />
            <br />

            {/* Total Panel */}
            <motion.div
                initial={{ opacity: 0, y: "-25%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay : 0.2 }}
            >
                <p className='text-sm font-bold bg-gray-700 p-1 mx-2 border-gray-500 border-2 rounded-t-xl'>Total</p>
                <div className='text-gray-100 text-3xl font-bold border-2 border-gray-500 rounded-b-3xl mx-2 p-2'>
                    <CountUp end={total} useEasing={false} preserveValue={true} duration='0.4' /> DA
                </div>
            </motion.div>
            <br />

            {/* Search Field */}
            <motion.div
                initial={{ opacity: 0, y: "-25%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay : 0.3 }}
            >
                <p className='text-sm font-bold bg-gray-700 p-1 border-gray-500 border-2 rounded-t-xl w-64 mx-auto md:w-96'>Rechercher un Produit</p>
                <input type="text" value={query} ref={ref} onChange={event => setQuery(event.target.value)} className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-b-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-1 w-64 mx-auto md:w-96'} placeholder='Codebar ou Nom du Produit...' />
            </motion.div>
            <br />
            <br />

            {/* Grid */}
            <motion.div className='text-gray-100 mt-2 mx-4 h-96 overflow-auto scrollbar'
                initial={{ opacity: 0, y: "-25%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay : 0.4 }}
            >
                {/* Header */}
                <div className='w-full flex flex-row'>
                    <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Produit(s)</div>
                    <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Prix Unitaire</div>
                    <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Quantité</div>
                    <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Montant</div>
                </div>
                {/* Nothing */}
                {Object.keys(products).length == 0 && <div className='bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Aucun produit a afficher...</div>}
                {/* Rows */}
                {Object.keys(products).map((pk) =>
                    <div className='w-full flex flex-row' key={products[pk]._id}>
                        <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{products[pk].name}</div>
                        <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{products[pk].price}</div>
                        <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{products[pk].amount}</div>
                        <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{products[pk].price * products[pk].amount}</div>
                    </div>
                )}</motion.div>

            {/* Mizzap Choice Panel */}
            {mizzappResult && <MizzappChoicePanel value={mizzappResult} weight={mizzapWeight} onClick={AddMizzapResult} />}
        </div>
    )
}

export default SalesPoint