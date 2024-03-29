import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus, FaEdit, FaTrash, FaCube } from 'react-icons/fa';
import RknPopup from '../components/RknUI/RknPopup';
import RknLoaderPopup from '../components/RknUI/RknLoaderPopup';
import { Navigate } from 'react-router-dom';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';

const ProductList = () => {

    useEffect(() => {

        GetComputerSpecsListFromDb();

    }, []);

    const [csList, setCsList] = useState();
    const [currentSpecsToPost, setCurrentSpecsToPost] = useState(null);
    const [busy, setBusy] = useState(false);

    const columns = [
        {
            title: 'Opérations',
            dataIndex: '',
            key: 'operations',
            width: 128,
            className: 'border border-gray-500',
            render: i => GenerateOperationButtons(i)
        },
        {
            title: 'Marque',
            dataIndex: 'brand',
            key: 'brand',
            className: 'border border-gray-500',
            width: 128
        },
        {
            title: 'Modèle',
            dataIndex: 'model',
            key: 'model',
            className: 'border border-gray-500',
            width: 128
        },
        {
            title: 'Processeur',
            dataIndex: 'cpu',
            key: 'cpu',
            width: 256,
            className: 'border border-gray-500'
        },
        {
            title: 'Etat',
            dataIndex: 'stateScore',
            key: 'stateScore',
            width: 64,
            className: 'border border-gray-500'
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            width: 64,
            className: 'border border-gray-500'
        }
    ];

    const GetComputerSpecsListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/computer-specs-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("CS = " + JSON.stringify(res.data));
                setCsList(res.data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GenerateOperationButtons = (ParamItem) => {

        const buttonStyle = 'bg-gray-900 text-gray-100 rounded-lg p-2 my-2 mx-1 text-sm hover:bg-gray-700 inline';

        if (ParamItem) {
            return (
                <div className='flex flex-row'>
                    <button className={buttonStyle} onClick={() => { ConvertCsToProduct(ParamItem._id); }}> <FaCube size={20} /> </button>
                </div>
            )
        }

        return "N/A";
    }

    const DeleteProductInDB = async (ParamID) => {

        // this.setState({ isBusy: true });
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/delete-product?id=" + ParamID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // setState({ isBusy: false });
                GetComputerSpecsListFromDb();
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const ConvertCsToProduct = async (ParamID) => {

        setBusy(true);
        
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/computer-specs-to-product?id=" + ParamID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                setBusy(false);
                console.log("R = " + JSON.stringify(res));

                if (res.data.message == "OK"){
                    window.open(GetBaseUrl() + "/product-editor?id=" + res.data.id, '_blank');
                }
            }
            
        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }

            setBusy(false);
        }
    }

    return (
        <div className='text-gray-100'>
            <br />
            <h3 className='text-xl font-bold'>Liste des Configurations d'Ordinateur</h3>
            <br />
            {/* <AwesomeButton before={<FaPlus />}><a href='/product-editor'>Ajouter Un Produit</a></AwesomeButton> */}
            <br />
            <div className='flex flex-col items-center overflow-x-visible md:overflow-x-hidden'>
                <Table columns={columns} data={csList} rowKey="_id" tableLayout='auto' />
            </div>
            <br />
            <br />
            {busy && <RknLoaderPopup/>}
        </div>
    )
}

export default ProductList