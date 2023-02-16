import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { data } from 'autoprefixer';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus } from 'react-icons/fa';

const ReceptionList = () => {

    useEffect(() => {

        GetReceptionListFromDb();

    }, []);

    const [receptionList, setReceptionList] = useState();
    const [tableData, setTableData] = useState();

    const columns = [
        {
            title: 'Identifiant',
            dataIndex: 'id',
            key: 'id',
            className: 'border border-gray-500',
            width: 256
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            className: 'border border-gray-500',
            width: 128,
            render: d => <p className='inline text-sm'>{(new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        },
        {
            title: 'Fournisseur',
            dataIndex: 'provider',
            key: 'provider',
            width: 256,
            className: 'border border-gray-500'
        },
        {
            title: 'Produits',
            dataIndex: 'products',
            key: 'products',
            width: 96,
            className: 'border border-gray-500'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 128,
            className: 'border border-gray-500'
        },
        {
            title: 'Etat',
            dataIndex: 'stockageDone',
            key: 'stockageDone',
            width: 128,
            className: 'border border-gray-500',
            render: i => i ? <p className='p-1 m-1 text-sm font-bold bg-green-800 border-2 border-green-500 rounded-xl'>Stockée</p> : <p className='p-1 m-1 text-sm border-2 border-neutral-500 text-gray-300 rounded-xl'>En attente...</p>
        }
    ];

    data = [
        { name: 'Jack', price: 28, altLangName: 'some where', category: 'ANY', key: '1' },
        { name: 'Jack', price: 28, altLangName: 'some where', category: 'ANY', key: '2' },
    ];

    const GetReceptionListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-reception-list-ready";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("RESULT = " + JSON.stringify(res.data));
                setReceptionList(res.data);
                // UpdateTableData(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    // const UpdateTableData = (ParamReceptionList) => {

    //     let result = [];

    //     ParamReceptionList.forEach(r => {
    //         result.push({
    //             id: r._id,
    //             name: p.name,
    //             price: p.price,
    //             altLangName: p.altLangName,
    //             category: p.category,
    //             buyable: p.buyable,
    //             sellable: p.sellable
    //         });
    //     });

    //     // return result;
    //     setTableData(result);
    // }

    // const handleSelect = (selection) => {
    //     console.log("HSK = " + selection.key);
    // }

    return (
        <div className='text-gray-100'>
            <br />
            <h3 className='text-xl font-bold'>Liste des Réception</h3>
            <br />
            <AwesomeButton before={<FaPlus />}><a href='/reception-editor'>Ajouter Une Réception</a></AwesomeButton>
            <br />
            <br />
            <div className='flex flex-col items-center'>
                <Table columns={columns} data={receptionList} rowKey="id" />
                {/* <ReceptionTable /> */}
            </div>
            <br />
            <br />
        </div>
    )
}

export default ReceptionList