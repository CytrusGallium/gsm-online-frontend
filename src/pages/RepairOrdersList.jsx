import React, { Component } from 'react';
import Table from 'rc-table';
import { GridLoader } from 'react-spinners';
import axios from "axios";
import { GetBackEndUrl } from '../const';
import DeviceIconList from '../components/DeviceIconList';
import { FaSearch, FaTimesCircle, FaWrench, FaLock, FaCheck, FaEdit, FaTrash, FaUnlock, FaKey } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../ModalWindow.css';
import { AwesomeButton } from 'react-awesome-button';
import { AwesomeButtonProgress } from "react-awesome-button";
import DeviceValidationList from '../components/DeviceValidationList';
import DeviceStateSelector from '../components/DeviceStateSelector';
import RepairOrderValidationPopup from '../components/RepairOrderValidationPopup';

export default class RepairOrderID extends Component {

    constructor(props) {
        super(props);
        this.state = { tableData: [], isBusy: false, validationWindowOpen: false, currentValidationRepairOrder: "" };
    }

    columns = [
        {
            title: 'Etat',
            dataIndex: 'locked',
            key: 'locked',
            className: 'border border-gray-500',
            width: 64,
            render: lock => <div className='flex flex-col items-center'> <p>{lock ? <FaLock /> : <FaWrench />}</p></div>
        },
        {
            title: 'Operations',
            dataIndex: '',
            key: 'operations',
            width: 128,
            className: 'border border-gray-500',
            // render: i => <button className='bg-gray-900 text-gray-100 rounded-lg p-2 my-2 text-sm hover:bg-gray-700' onClick={() => { this.setState({ validationWindowOpen: true, currentValidationRepairOrder: i }); }}>Valider</button>
            render: i => this.GenerateOperationButtons(i)
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
            className: 'border border-gray-500',
            render: d => (new Date(d)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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

    popupOnClose() {
        console.log("popupOnClose()");
        this.setState({ validationWindowOpen: false });
    }

    render() {
        return (
            <div className='text-gray-100 flex flex-col items-center'>
                Liste des Orders de Réparation
                <RepairOrderValidationPopup value={this.state.currentValidationRepairOrder} isOpen={this.state.validationWindowOpen} onClose={() => { this.popupOnClose() }} />
                <br />
                <br />
                <div>
                    <FaSearch className='inline' size={24} />
                    <span className='mx-1'> </span>
                    <input type="text" value={this.state.inputValue} className='inline rounded p-2 text-black' onChange={e => this.SearchFieldOnChange(e)} placeholder="Identifiant du bon..." />
                    <span className='mx-1'> </span>
                </div>
                <br />
                <br />
                {this.state.isBusy ? <GridLoader color='#AAAAAA' /> : <>{this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData} rowKey="roid" className='ml-16' /> : <p>Aucun Ordre de Réparation à Afficher...</p>}</>}
            </div>
        )
    }

    async GetRepairOrdersListFromDB(ParamROID) {

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
        console.log("DATA = " + JSON.stringify(ParamTableData));
        this.setState({ tableData: ParamTableData });
    }

    searchTimeOut = null;

    SearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB(ParamEvent.target.value) }, 500);
    }

    GenerateOperationButtons(ParamRepairOrder) {

        const buttonStyle = 'bg-gray-900 text-gray-100 rounded-lg p-2 my-2 mx-1 text-sm hover:bg-gray-700 inline';

        if (ParamRepairOrder) {
            if (ParamRepairOrder.locked) {
                return <button className={buttonStyle} onClick={() => { console.log("Unlock"); }}><FaKey size={20} /></button>
            }
            else {
                return (
                    <div className='flex flex-row'>
                        <button className={buttonStyle} onClick={() => { this.setState({ validationWindowOpen: true, currentValidationRepairOrder: ParamRepairOrder }); }}> <FaCheck size={20} /> </button>
                        <button className={buttonStyle} onClick={() => { console.log("EDIT"); }}> <FaEdit size={20} /> </button>
                        <button className={buttonStyle} onClick={() => { console.log("DELETE"); }}> <FaTrash size={20} /> </button>
                    </div>
                )
            }
        }

        return "N/A";
    }
}