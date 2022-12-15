import React, { Component } from 'react';
import Table from 'rc-table';
import { GridLoader, PulseLoader } from 'react-spinners';
import axios from "axios";
import GetBackEndUrl from '../const';
import DeviceIconList from '../components/DeviceIconList';

export default class RepairOrderID extends Component {

    constructor(props) {
        super(props);
        this.state = { tableData: [] };
    }

    columns = [
        {
            title: 'Identifiant',
            dataIndex: 'roid',
            key: 'roid',
            width: 200,
            className: 'border border-gray-500'
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            width: 200,
            className: 'border border-gray-500'
        },
        {
            title: 'Client',
            dataIndex: 'customer',
            key: 'customer',
            width: 300,
            className: 'border border-gray-500'
        },
        {
            title: 'N° Téléphone',
            dataIndex: 'phone',
            key: 'phone',
            width: 200,
            className: 'border border-gray-500'
        },
        {
            title: 'Liste des Appareils',
            dataIndex: 'items',
            key: 'items',
            className: 'border border-gray-500',
            // render: i => <p>Para {i[0].imei}</p>
            // render: items => items.map(i => <p>{i.deviceType}</p>)
            render: items => <DeviceIconList value={items}/>
        }
    ];

    data = [
        { name: 'Jack', age: 28, address: 'some where', key: '1' },
        { name: 'Rose', age: 36, address: 'some where', key: '2' },
    ];

    isBusy = false;

    componentDidMount() {
        this.GetRepairOrdersListFromDB();
    }

    render() {
        return (
            <div className='text-gray-100 flex flex-col items-center'>
                Liste des Orders de Réparation
                <br />
                <br />
                {this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData} /> : <GridLoader  color='#AAAAAA' />}
            </div>
        )
    }

    async GetRepairOrdersListFromDB() {

        this.isbusy = true;
        let res;

        try {

            // Build Req/Res
            const url = GetBackEndUrl() + "/api/get-repair-orders-list";
            res = await axios.get(url);

            if (res) {
                this.UpdateTableData(res.data);
                this.isbusy = false;
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    UpdateTableData(ParamTableData) {
        console.log("QUERY RESULT = " + JSON.stringify(ParamTableData));
        this.setState({ tableData: ParamTableData });
        // this.props.OnChange(result);
        this.forceUpdate();
    }
}