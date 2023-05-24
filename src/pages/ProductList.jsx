import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { data } from 'autoprefixer';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus, FaInfinity, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductList = () => {

    useEffect(() => {

        GetProductListFromDb();

    }, []);

    const [productList, setProductList] = useState();
    const [tableData, setTableData] = useState();

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
            title: 'Designation',
            dataIndex: '',
            key: 'name',
            className: 'border border-gray-500',
            width: 256,
            render: i => <a href={GetBaseUrl() + "/product-editor?id=" + i.id}>{i.name}</a>
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            className: 'border border-gray-500',
            width: 64
        },
        {
            title: 'Designation en Arabe',
            dataIndex: 'altLangName',
            key: 'altLangName',
            width: 256,
            className: 'border border-gray-500'
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
            width: 128,
            className: 'border border-gray-500'
        },
        {
            title: 'Achetable',
            dataIndex: 'buyable',
            key: 'buyable',
            width: 128,
            className: 'border border-gray-500',
            render: i => i ? "Oui" : "Non"
        },
        {
            title: 'Vendable',
            dataIndex: 'sellable',
            key: 'sellable',
            width: 128,
            className: 'border border-gray-500',
            render: i => i ? "Oui" : "Non"
        },
        {
            title: 'Disponible',
            dataIndex: '',
            key: 'availableAmount',
            width: 128,
            className: 'border border-gray-500',
            render: i => i.buyable ? i.availableAmount : <FaInfinity className='inline' color='555555' />
        },
        {
            title: 'Temps de Préparation',
            dataIndex: 'preparationDuration',
            key: 'preparationDuration',
            width: 128,
            className: 'border border-gray-500'
        }
    ];

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list?resolveCategoryID=true&ignoreDeleted=true";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setProductList(res.data);
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

    const UpdateTableData = (ParamProductList) => {

        let result = [];

        ParamProductList.forEach(p => {
            result.push({
                id: p._id,
                name: p.name,
                price: p.price,
                altLangName: p.altLangName,
                category: p.category,
                buyable: p.buyable,
                sellable: p.sellable,
                availableAmount: p.availableAmount,
                preparationDuration: p.preparationDuration
            });
        });

        // return result;
        setTableData(result);
    }

    const GenerateOperationButtons = (ParamItem) => {

        const buttonStyle = 'bg-gray-900 text-gray-100 rounded-lg p-2 my-2 mx-1 text-sm hover:bg-gray-700 inline';

        if (ParamItem) {
            return (
                <div className='flex flex-row'>
                    <button className={buttonStyle}> <Link to={"/product-editor?id=" + ParamItem.id}> <FaEdit size={20} /></Link> </button>
                    <button className={buttonStyle} onClick={() => { console.log("DELETE"); DeleteProductInDB(ParamItem.id)}}> <FaTrash size={20} /> </button>
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
                GetProductListFromDb();
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    return (
        <div className='text-gray-100'>
            <br />
            <h3 className='text-xl font-bold'>Liste des Produits</h3>
            <br />
            <AwesomeButton before={<FaPlus />}><a href='/product-editor'>Ajouter Un Produit</a></AwesomeButton>
            <br />
            <br />
            <div className='flex flex-col items-center overflow-x-visible md:overflow-x-hidden'>
                <Table columns={columns} data={tableData} rowKey="id" tableLayout='auto' />
            </div>
            <br />
            <br />
        </div>
    )
}

export default ProductList