import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus } from 'react-icons/fa';

const ProviderList = () => {

    useEffect(() => {

        GetProviderListFromDb();

    }, []);

    const [providerList, setProviderList] = useState();
    const [tableData, setTableData] = useState();

    const columns = [
        {
            title: 'Prénom',
            dataIndex: 'firstName',
            key: 'firstName',
            className: 'border border-gray-500',
            width: 256
        },
        {
            title: 'Nom',
            dataIndex: 'familyName',
            key: 'familyName',
            className: 'border border-gray-500',
            width: 256
        }
    ];

    const GetProviderListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-provider-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                console.log("PROVIDER LIST RESULT = " + JSON.stringify(res.data));
                // setProviderList(res.data);
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

    const UpdateTableData = (ParamProviderList) => {

        let result = [];

        ParamProviderList.forEach(p => {
            result.push({
                firstName: p.firstName,
                familyName: p.familyName
            });
        });

        setTableData(result);
    }

    return (
        <div className='text-gray-100'>
            <br />
            <h3 className='text-xl font-bold'>Liste des Fournisseurs</h3>
            <br />
            <AwesomeButton before={<FaPlus />}><a href='/provider-editor'>Ajouter Un Fournisseur</a></AwesomeButton>
            <br />
            <br />
            <div className='flex flex-col items-center'>
                <Table columns={columns} data={tableData} rowKey="id" />
            </div>
            <br />
            <br />
        </div>
    )
}

export default ProviderList