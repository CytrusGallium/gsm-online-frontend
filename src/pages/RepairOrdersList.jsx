import React, { Component } from 'react';
import Table from 'rc-table';
import { GridLoader, PulseLoader } from 'react-spinners';
import axios from "axios";
import GetBackEndUrl from '../const';
import DeviceIconList from '../components/DeviceIconList';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

export default class RepairOrderID extends Component {

    constructor(props) {
        super(props);
        this.state = { tableData: [], isBusy: false };
    }

    columns = [
        {
            title: 'Operations',
            dataIndex: '',
            key: 'operations',
            width: 512,
            className: 'border border-gray-500',
            render: () => <a href="#">Valider</a>
        },
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
            width: 256,
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
            width: 256,
            render: items => <DeviceIconList value={items} />
        }
    ];

    data = [
        { name: 'Jack', age: 28, address: 'some where', key: '1' },
        { name: 'Rose', age: 36, address: 'some where', key: '2' },
    ];

    // isBusy = false;

    componentDidMount() {
        this.GetRepairOrdersListFromDB();
    }

    render() {
        return (
            <div className='text-gray-100 flex flex-col items-center'>
                Liste des Orders de Réparation
                <br />
                <br />
                <div>
                    <FaSearch className='inline' size={24} />
                    <span className='mx-1'> </span>
                    <input type="text" value={this.state.inputValue} className='inline rounded p-2 text-black' onChange={e => this.SearchFieldOnChange(e)} placeholder="Identifiant du bon..." />
                    {/* <span className='mx-1'> </span>
                    <FaTimesCircle className='inline cursor-pointer' size={24} color="#999999" onClick={this.state.inputValue = ""}/> */}
                </div>
                <br />
                <br />
                {/* {this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData}/> : <>{this.state.isBusy ? <GridLoader color='#AAAAAA' /> : <p>No Data To Display...</p>}</>} */}
                {this.state.isBusy ? <GridLoader color='#AAAAAA' /> : <>{this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData} /> : <p>No Data To Display...</p>}</>}
            </div>
        )
    }

    async GetRepairOrdersListFromDB(ParamROID) {

        console.log("STATE = " + JSON.stringify(this.state));

        // this.state.isbusy = true;
        this.setState({ isBusy: true });
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-repair-orders-list";

            if (ParamROID && ParamROID.length > 1)
                url += "?roid=" + ParamROID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                this.UpdateTableData(res.data);
                // this.state.isbusy = false;
                this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    UpdateTableData(ParamTableData) {
        // console.log("QUERY RESULT = " + JSON.stringify(ParamTableData));
        this.setState({ tableData: ParamTableData });
        // this.state.tableData = ParamTableData;
        // this.props.OnChange(result);
        this.forceUpdate();
    }

    searchTimeOut = null;

    SearchFieldOnChange(ParamEvent) {
        // console.log("C : " + ParamEvent.target.value);

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        // this.searchTimeOut = setTimeout(() => {this.RunSearchFromDB(ParamEvent.target.value)}, 500);
        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB(ParamEvent.target.value) }, 500);
    }

    // RunSearchFromDB(ParamROID) {
    //     console.log("Searching For : " + ParamROID);
    // }
}