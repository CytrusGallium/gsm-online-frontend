import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import ConsumedProductTag from '../components/ConsumedProductTag';
import { FaEyeSlash } from 'react-icons/fa';

const CateringSalesList = () => {

    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, []);

    const [coList, setCoList] = useState();
    const [tableData, setTableData] = useState();
    const [showEmpty, setShowEmpty] = useState(false);

    const columns = [
        {
            title: 'N°',
            dataIndex: 'coid',
            key: 'coid',
            width: 64,
            className: 'border border-gray-500'
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            width: 128,
            className: 'border border-gray-500',
            render: d => <p className='inline text-sm'>{(new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
        },
        {
            title: 'Prix total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 96,
            className: 'border border-gray-500'
        },
        {
            title: 'Prix payer',
            dataIndex: 'fulfilledPaiement',
            key: 'fulfilledPaiement',
            width: 96,
            className: 'border border-gray-500'
        },
        {
            title: 'Consomation(s)',
            dataIndex: 'consumedProducts',
            key: 'consumedProducts',
            width: 512,
            className: 'border border-gray-500 p-2',
            // render: i => <p>{i.consumedProducts && i.consumedProducts.length}</p>
            // render: i => <p>{i ? (i.consumedProducts ? "YES2" : "NO2") : "NO"}</p>
            // render: i => <p>{i ? Object.keys(i).length : "N/A"}</p>
            // render: i => <p>{i ? Object.keys(i).map((keyName, i) => (<ConsumedProductTag key={keyName} value={i[keyName]} />)) : "N/A"}</p>
            // render: i => <p>{i ? Object.keys(i).map((keyName, index) => <p key={keyName}>{i[keyName].name}</p>) : "N/A"}</p>
            render: i => i ? Object.keys(i).map((keyName, index) => <ConsumedProductTag key={keyName} value={i[keyName]} />) : <FaEyeSlash className='inline' />
        },
        {
            title: 'Vierge ?',
            dataIndex: 'empty',
            key: 'empty',
            width: 96,
            className: 'border border-gray-500',
            render: i => i ? "Oui" : "Non"
        },
        {
            title: 'Finaliser ?',
            dataIndex: 'finalized',
            key: 'finalized',
            width: 96,
            className: 'border border-gray-500',
            render: i => i ? "Oui" : "Non"
        }
    ];

    const data = [
        { name: 'Jack', price: 28, altLangName: 'some where', category: 'ANY', key: '1' },
        { name: 'Jack', price: 28, altLangName: 'some where', category: 'ANY', key: '2' },
    ];

    const GetCateringOrdersListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-catering-orders-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("RESULT = " + JSON.stringify(res));
                setCoList(res.data);
                UpdateTableData(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const UpdateTableData = (ParamCoList) => {

        let result = [];

        ParamCoList.forEach(co => {
            result.push({ id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time });
        });

        setTableData(result);
    }

    const GetTableData = (ParamCoList, ParamShowEmpty) => {

        let result = [];

        ParamCoList.forEach(co => {
            if (co.empty && ParamShowEmpty)
                result.push({ id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time });
            else if (!co.empty)
                result.push({ id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time });
        });

        return result;
    }

    return (
        <div className='text-gray-100'>
            <h3 className='text-xl font-bold'>Liste des Ventes / Liste des Ordres de Restauration</h3>
            <br />
            <br />
            <Table columns={columns} data={showEmpty ? GetTableData(coList, true) : GetTableData(coList, false)} rowKey="id" className='ml-16' />
        </div>
    )
}

export default CateringSalesList