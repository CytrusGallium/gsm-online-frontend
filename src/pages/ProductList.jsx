import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { data } from 'autoprefixer';

const ProductList = () => {

    const GetBaseUrl = () => {
        var baseUrl = '' + window.location;
        var pathArray = baseUrl.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;

        return url;
    }
    
    useEffect(() => {

        GetProductListFromDb();

    }, []);

    const [productList, setProductList] = useState();
    const [tableData, setTableData] = useState();

    const columns = [
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
        }
    ];

    data = [
        { name: 'Jack', price: 28, altLangName: 'some where', category:'ANY', key: '1' },
        { name: 'Jack', price: 28, altLangName: 'some where', category:'ANY', key: '2' },
    ];

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("RESULT = " + JSON.stringify(res));
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
            result.push({id:p._id, name : p.name, price : p.price, altLangName : p.altLangName, category : p.category});
        });

        // return result;
        setTableData(result);
    }

    return (
        <div className='text-gray-100'>
            <h3 className='text-xl font-bold'>Liste des Produits</h3>
            <br/>
            <br/>
            <Table columns={columns} data={tableData} rowKey="id" className='ml-16' />
        </div>
    )
}

export default ProductList