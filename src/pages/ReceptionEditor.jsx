import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReceptionTable from '../components/ReceptionTable';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { AwesomeButton, AwesomeButtonProgress } from 'react-awesome-button';
import { BarLoader } from 'react-spinners';
import Table from 'rc-table';

const ReceptionEditor = () => {

    // Navigation
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Effect
    useEffect(() => {

        if (searchParams.get("id")) {
            GetReceptionFromDB(searchParams.get("id"));
            // console.log("SEARCH PARAM ID = " + searchParams.get("id"));
            // setTargetID(searchParams.get("id"));
        }
        else {
            // GenerateNewCateringOrder();
            // setInitialReceptionTableValue([]);
        }

        getProviderListFromDB();

    }, []);

    const [ID, setID] = useState(null);
    const [provider, setProvider] = useState("");
    const [receptionTableValue, setReceptionTableValue] = useState([]);
    const [tableData, setTableData] = useState([]);
    // const [initialReceptionTableValue, setInitialReceptionTableValue] = useState(null);
    const [providersList, setProvidersList] = useState([]);
    const [total, setTotal] = useState(0);
    const [stored, setStored] = useState(false);
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2 w-4/5';

    const columns = [
        {
            title: 'Produit',
            dataIndex: 'product',
            key: 'product',
            className: 'border border-gray-500',
            width: 256
        },
        {
            title: 'Qte',
            dataIndex: 'amount',
            key: 'amount',
            className: 'border border-gray-500',
            width: 128
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            className: 'border border-gray-500',
            width: 128
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            className: 'border border-gray-500',
            width: 128
        }
    ];

    const getProviderListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-provider-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setProvidersList(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const handleProviderOnChange = (ParamEvent) => {
        // console.log("V = " + ParamEvent.target.value);
        setProvider(ParamEvent.target.value);
        setChangesAvailable(true);
    }

    const handleTableOnChange = (ParamRows) => {
        setReceptionTableValue(ParamRows);
        updateTotalPrice(ParamRows);
        setChangesAvailable(true);
    }

    const updateTotalPrice = (ParamRows) => {
        // console.log("PARAM ROWS = " + JSON.stringify(ParamRows));
        let total = 0;
        Object.keys(ParamRows).forEach(k => {
            total += Number(ParamRows[k].total);
        });
        setTotal(total);
    }

    const handleOnSaveToDB = async () => {

        if (ID)
            updateReceptionInDB();
        else
            saveNewReceptionInDB();

    }

    const saveNewReceptionInDB = async () => {
        try {

            setIsSaving(true);
            let receptionToPost = { provider: provider, products: receptionTableValue, totalPrice: total };
            let url = GetBackEndUrl() + "/api/new-reception";
            console.log("POST : " + url);
            let res = await axios.post(url, receptionToPost);

            if (res) {
                // console.log("RES = " + JSON.stringify(res));
                console.log("ID = " + res.data.id);
                setID(res.data.id);
                setChangesAvailable(false);
            }


        } catch (error) {
            console.log("ERROR : " + error);
        }

        setIsSaving(false);
    }

    const updateReceptionInDB = async () => {
        try {

            setIsSaving(true);
            let receptionToPost = { id: ID, provider: provider, products: receptionTableValue, totalPrice: total };
            let url = GetBackEndUrl() + "/api/update-reception";
            console.log("POST : " + url);
            let res = await axios.post(url, receptionToPost);

            if (res) {
                // console.log("RES = " + JSON.stringify(res));
                // console.log("ID = " + res.data.id);
                // setID(res.data.id);
                setChangesAvailable(false);
            }

        } catch (error) {
            console.log("ERROR : " + error);
        }

        setIsSaving(false);
    }

    const handleOnPerformStorage = async () => {

        return new Promise(async (resolve) => {

            if (stored) {
                resolve(false);
            }

            try {

                let storageOperationInfoToPost = { id: ID };
                let url = GetBackEndUrl() + "/api/perform-reception-storage";
                console.log("POST : " + url);
                let res = await axios.post(url, storageOperationInfoToPost);

                if (res) {
                    console.log("RES = " + JSON.stringify(res));
                    setStored(true);
                    GetReceptionFromDB(ID);
                    resolve(true);
                } else {
                    setStored(false);
                    resolve(false);
                }

            } catch (error) {
                console.log("ERROR : " + error);
            }
        });
    }

    const GetReceptionFromDB = async (ParamID) => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-reception?id=" + ParamID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("RESULT = " + JSON.stringify(res.data));
                setID(res.data._id);
                PrepareAndUpdateTableData(res.data);
                // setInitialReceptionTableValue(res.data.products);
                // setProductInfo({ name: res.data.name, description: res.data.description, altLangName: res.data.altLangName, price: res.data.price, category: res.data.category });
                // setBuyable(res.data.buyable);
                // setSellable(res.data.sellable);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const PrepareAndUpdateTableData = (ParamQueryResult) => {
        let result = [];

        if (ParamQueryResult.products) {
            Object.keys(ParamQueryResult.products).forEach(k => {
                result.push({
                    id: k,
                    product: ParamQueryResult.products[k].product.value,
                    amount: ParamQueryResult.products[k].amount,
                    price: ParamQueryResult.products[k].price,
                    total: ParamQueryResult.products[k].total
                })
            });
        }

        setTableData(result);
    }

    return (
        <div className='flex flex-col items-center'>
            <br />
            <label className="block text-sm font-medium text-gray-900 dark:text-white">Fournisseur :</label>
            <select name="provider" className={inputFieldStyle} value={provider} onChange={(handleProviderOnChange)}>
                <option value="NULL" defaultValue>Aucun</option>
                {providersList.map((p, index) => (
                    <option key={index} value={p._id}>
                        {p.firstName + " " + p.familyName}
                    </option>
                ))}
            </select>
            <br />
            {!stored && <ReceptionTable onChange={handleTableOnChange} />} 
            {stored && <Table className='text-gray-100' columns={columns} data={tableData} rowKey="id" />} 
            <br />
            <p className='text-gray-100 bg-gray-700 rounded-xl text-3xl font-bold p-2 m-1'>Total : {total} DA</p>
            <br />
            {changesAvailable && !isSaving && <AwesomeButton type='primary' onPress={handleOnSaveToDB} >Enregistrer</AwesomeButton>}
            {isSaving && <BarLoader color='#AAAAAA' />}
            <br />
            {!stored && ID && !changesAvailable && <AwesomeButtonProgress type='primary' onPress={async (element, next) => { await handleOnPerformStorage(); next(); }} >Effectuer le stockage</AwesomeButtonProgress>}
            {stored && ID && !changesAvailable && <AwesomeButtonProgress type='danger' onPress={async (element, next) => { next(); }} >Effectuer Un Déstockage</AwesomeButtonProgress>}
        </div>
    )
}

export default ReceptionEditor