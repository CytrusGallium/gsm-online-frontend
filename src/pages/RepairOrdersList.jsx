import React, { Component } from 'react';
import Table from 'rc-table';
import { GridLoader } from 'react-spinners';
import axios from "axios";
import { GetBackEndUrl } from '../const';
import DeviceIconList from '../components/DeviceIconList';
import { FaSearch, FaWrench, FaLock, FaCheck, FaEdit, FaTrash, FaUnlock, FaKey, FaFileExcel, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../ModalWindow.css';
import { AwesomeButton } from 'react-awesome-button';
import { AwesomeButtonProgress } from "react-awesome-button";
import DeviceValidationList from '../components/DeviceValidationList';
import DeviceStateSelector from '../components/DeviceStateSelector';
import RepairOrderValidationPopup from '../components/RepairOrderValidationPopup';
import { GetBaseUrl } from '../Reaknotron/Libs/RknRouterUtils';
import { Link } from 'react-router-dom';
import { IsAdmin } from '../LoginManager';
import RepairOrdersTable from '../components/RepairOrdersTable/RepairOrdersTable';

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
            title: 'Opérations',
            dataIndex: '',
            key: 'operations',
            width: 128,
            className: 'border border-gray-500',
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
            title: "Date d'Entrée",
            dataIndex: 'time',
            key: 'time',
            width: 256,
            className: 'border border-gray-500',
            render: d => <p className='text-sm'>{(new Date(d)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        },
        {
            title: 'Date de Sortie',
            dataIndex: 'exitDate',
            key: 'exitDate',
            width: 256,
            className: 'border border-gray-500',
            render: d => <p className='text-sm'>{d ? (new Date(d)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</p>
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
            render: items => <div>{<DeviceIconList value={items} />}</div>
        }
    ];

    data = [
        { name: 'Jack', age: 28, address: 'some where', key: '1' },
        { name: 'Rose', age: 36, address: 'some where', key: '2' },
    ];

    page = 0;

    // isBusy = false;

    componentDidMount() {
        this.GetRepairOrdersListFromDB();
    }

    popupOnClose() {
        // console.log("popupOnClose()");
        this.setState({ validationWindowOpen: false, currentValidationRepairOrder: "" });
        this.GetRepairOrdersListFromDB();
    }

    async GetRepairOrdersListFromDB(ParamSearchProperty, ParamSearchProbe) {

        this.setState({ isBusy: true });
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-repair-orders-list?page=" + this.page;

            if (ParamSearchProbe && ParamSearchProbe.length > 1)
                url += `?${ParamSearchProperty}=` + ParamSearchProbe;

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

    async DeleteRepairOrderFromDB(ParamROID) {

        this.setState({ isBusy: true });
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/delete-repair-order?roid=" + ParamROID;

            // if (ParamSearchProbe && ParamSearchProbe.length > 1)
            //     url += `?${ParamSearchProperty}=` + ParamSearchProbe;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // this.UpdateTableData(res.data);
                this.GetRepairOrdersListFromDB("", "");
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
        // console.log("DATA = " + JSON.stringify(ParamTableData));
        this.setState({ tableData: ParamTableData });
    }

    searchTimeOut = null;

    RoidSearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB("roid", ParamEvent.target.value) }, 500);
    }

    CustomerSearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB("customer", ParamEvent.target.value) }, 500);
    }

    PhoneSearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB("phone", ParamEvent.target.value) }, 500);
    }

    IMEISearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB("imei", ParamEvent.target.value) }, 500);
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
                        {IsAdmin() && <button className={buttonStyle}> <Link to={"/add-repair-order?id=" + ParamRepairOrder.roid}> <FaEdit size={20} /></Link> </button>}
                        <button className={buttonStyle} onClick={() => { console.log("DELETE"); this.DeleteRepairOrderFromDB(ParamRepairOrder.roid) }}> <FaTrash size={20} /> </button>
                    </div>
                )
            }
        }

        return "N/A";
    }

    render() {
        return (
            <div className='text-gray-100 flex flex-col items-center'>
                <br />
                <h3 className='font-bold text-xl' >Liste des Ordres de Réparation</h3>
                {IsAdmin() && <a href={GetBackEndUrl() + "/api/get-ro-list-xls"} target="_blank" className='text-sm text-gray-400 bg-gray-800 border border-gray-400 p-1 rounded-lg m-1 hover:text-gray-100 hover:border-gray-100'> <FaFileExcel className='inline mb-1' /> Download Excel File</a>}
                <RepairOrderValidationPopup value={this.state.currentValidationRepairOrder} isOpen={this.state.validationWindowOpen} onClose={() => { this.popupOnClose() }} />
                <br />
                <br />
                <div>
                    <FaSearch className='hidden md:inline' size={24} />
                    <input type="text" value={this.state.roidInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => this.RoidSearchFieldOnChange(e)} placeholder="Identifiant du bon..." />
                    <input type="text" value={this.state.customerInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => this.CustomerSearchFieldOnChange(e)} placeholder="Nom du client..." />
                    <input type="text" value={this.state.phoneInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => this.PhoneSearchFieldOnChange(e)} placeholder="N° de Téléphone..." />
                    <input type="text" value={this.state.imeiInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => this.IMEISearchFieldOnChange(e)} placeholder="IMEI/NS..." />
                </div>
                <br />
                <br />
                <RepairOrdersTable items={this.state.tableData} onValidationClick={(ParamRepairOrder) => { this.setState({ validationWindowOpen: true, currentValidationRepairOrder: ParamRepairOrder }); }} onDeleteClick={(ParamRepairOrder) => { this.DeleteRepairOrderFromDB(ParamRepairOrder.roid) }} />
                <br />
                <div className='flex flex-row'>
                    <FaArrowLeft className='inline p-1 border border-gray-500 bg-gray-900 mr-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer' size={24} onClick={() => {this.page -= 1; this.GetRepairOrdersListFromDB(); }}/>
                    <p className='inline'>Page {this.page + 1}</p>
                    <FaArrowRight className='inline p-1 border border-gray-500 bg-gray-900 ml-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer' size={24} onClick={() => {this.page += 1; this.GetRepairOrdersListFromDB(); }}/>
                </div>
                {/* {this.state.isBusy ? <GridLoader color='#AAAAAA' /> : <>{this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData} rowKey="roid" className='mx-4' /> : <p>Aucun Ordre de Réparation à Afficher...</p>}</>} */}
                <br />
            </div>
        )
    }
}