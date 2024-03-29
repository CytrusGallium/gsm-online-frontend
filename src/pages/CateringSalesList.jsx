import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import ConsumedProductTag from '../components/ConsumedProductTag';
import { FaEyeSlash, FaEdit, FaTrash, FaShoppingBag } from 'react-icons/fa';

const CateringSalesList = () => {

    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, []);

    // const navigate = useNavigate();

    const [coList, setCoList] = useState();
    const [tableData, setTableData] = useState();
    const [showEmpty, setShowEmpty] = useState(false);
    // const [totalConsumptionPrice, setTotalConsumptionPrice] = useState(0);
    // const [totalFulfilledPaiement, setTotalFulfilledPaiement] = useState(0);

    const columns = [
        {
            title: 'N°',
            dataIndex: 'coid',
            key: 'coid',
            width: 64,
            className: 'border border-gray-500'
        },
        {
            title: 'Operations',
            dataIndex: '',
            key: 'operations',
            width: 128,
            className: 'border border-gray-500',
            render: i => GenerateOperationButtons(i)
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            width: 128,
            className: 'border border-gray-500',
            render: d => <p className='inline text-sm'>{(new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        },
        {
            title: 'Heure de Paiement',
            dataIndex: 'finalizationTime',
            key: 'finalizationTime',
            width: 128,
            className: 'border border-gray-500',
            render: d => <p className='inline text-sm'>{d ? (new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</p>
            // render: d => JSON.stringify(d)
        },
        {
            title: 'Table',
            dataIndex: 'cst',
            key: 'cst',
            width: 128,
            className: 'border border-gray-500',
            render: t => <p className='inline text-sm'>{t ? "Table " + t.name : <FaShoppingBag size={32} className='inline'/>}</p>
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
                // console.log("RESULT = " + JSON.stringify(res));
                setCoList(res.data);
                UpdateTableData(res.data);
                // setTotalConsumptionPrice(GetTotalConsumptionPrice(res.data));
                // setTotalFulfilledPaiement(GetTotalFulfilledPaiement(res.data));
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

        // console.log("ParamCoList = " + JSON.stringify(ParamCoList));

        let result = [];

        ParamCoList.forEach(co => {
            let row = { id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time, finalizationTime: co.finalizationTime };
            if (co.table[0]) {
                row.cst = co.table[0];
                // console.log("TABLE = " + JSON.stringify(co.table[0]));
            }
            console.log("ROW = " + JSON.stringify(row));
            result.push(row);
        });

        // console.log("RESULT = " + JSON.stringify(result));

        setTableData(result);
    }

    const GetTableData = (ParamCoList, ParamShowEmpty) => {

        if (!ParamCoList)
            return [];

        let result = [];

        ParamCoList.forEach(co => {
            if (co.empty && ParamShowEmpty)
                result.push({ id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time });
            else if (!co.empty)
                result.push({ id: co._id, coid: co.coid, totalPrice: co.totalPrice, fulfilledPaiement: co.fulfilledPaiement, consumedProducts: co.consumedProducts, empty: co.empty, finalized: co.finalized, time: co.time });
        });

        return result;
    }

    const GetTotalConsumptionPrice = (ParamCoList) => {
        let result = 0;

        ParamCoList.forEach(co => {
            result += co.totalPrice;
        });

        return result;
    }

    const GetTotalFulfilledPaiement = (ParamCoList) => {
        let result = 0;

        ParamCoList.forEach(co => {
            result += co.fulfilledPaiement;
        });

        return result;
    }

    const GenerateOperationButtons = (ParamCateringOrder) => {

        const buttonStyle = 'bg-gray-900 text-gray-100 rounded-lg p-2 my-2 mx-1 text-sm hover:bg-gray-700 inline';

        if (ParamCateringOrder) {
            return (
                <div className='flex flex-row ml-4'>
                    <button className={buttonStyle}> <a href={GetBaseUrl() + "/catering-sales-point?id=" + ParamCateringOrder.id}><FaEdit size={20} /></a> </button>
                    <button className={buttonStyle} onClick={() => { DeleteRepairOrderFromDB(ParamCateringOrder.id); }}> <FaTrash size={20} /> </button>
                </div>
            )
        }

        return "N/A";
    }

    const DeleteRepairOrderFromDB = async (ParamCOID) => {

        // this.setState({ isBusy: true });
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/delete-catering-order?id=" + ParamCOID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // this.UpdateTableData(res.data);
                // this.GetRepairOrdersListFromDB("", "");
                // this.setState({ isBusy: false });
                window.location.reload(false);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    return (
        <div className='text-gray-100 flex flex-col items-center'>
            <h3 className='text-xl font-bold'>Liste des Ventes / Liste des Ordres de Restauration</h3>
            <br />
            <br />
            {/* <Table columns={columns} data={showEmpty ? GetTableData(coList, true) : GetTableData(coList, false)} rowKey="id" className='ml-16' /> */}
            <Table columns={columns} data={tableData} rowKey="id" className='mx-4' />
            <br />
            <br />
        </div>
    )
}

export default CateringSalesList