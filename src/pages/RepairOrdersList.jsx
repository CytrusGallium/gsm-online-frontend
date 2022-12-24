import React, { Component } from 'react';
import Table from 'rc-table';
import { GridLoader, PulseLoader } from 'react-spinners';
import axios from "axios";
import GetBackEndUrl from '../const';
import DeviceIconList from '../components/DeviceIconList';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../ModalWindow.css';
import { AwesomeButton } from 'react-awesome-button';
import { AwesomeButtonProgress } from "react-awesome-button";
import DeviceValidationList from '../components/DeviceValidationList';

export default class RepairOrderID extends Component {

    constructor(props) {
        super(props);
        this.state = { tableData: [], isBusy: false, validationWindowOpen: false, currentValidationROID: "" };
    }

    columns = [
        {
            title: 'Operations',
            dataIndex: '',
            key: 'operations',
            width: 256,
            className: 'border border-gray-500',
            render: i => <button onClick={() => { this.setState({ validationWindowOpen: true, currentValidationROID: i }) }}>Valider</button>
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

    CloseModal() {
        console.log("CLOSE MODAL");
        this.setState({ validationWindowOpen: false });
    }

    render() {
        return (
            <div className='text-gray-100 flex flex-col items-center'>
                Liste des Orders de Réparation
                <Popup
                    open={this.state.validationWindowOpen}
                    modal
                    closeOnDocumentClick
                    onClose={() => { this.CloseModal(); }}
                >
                    <div className="modal bg-gray-900 text-gray-100 p-2">
                        <button className="close" onClick={() => { this.CloseModal(); }}>
                            <FaTimesCircle />
                        </button>
                        <div className="header"> Validation de l'Ordre de Réparation </div>
                        <div className="content flex flex-col items-center">
                            Identifiant : {this.state.currentValidationROID.roid}
                            <br />
                            <DeviceIconList value={this.state.currentValidationROID.items} />
                            <br />
                            <br />
                            {/* <select name="state" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue="DONE">
                                <option value="PENDING">En Cours de Réparation</option>
                                <option value="DONE">Réparer</option>
                                <option value="UNFIXABLE">Irréparable</option>
                                <option value="CANCELED">Annulé</option>
                            </select> */}
                            {/* <DeviceStateSelector onChange={(v) => {console.log(v)}}/> */}
                            <DeviceValidationList value={this.state.currentValidationROID.items} />
                            <br />
                            <AwesomeButtonProgress type="primary" onPress={async (element, next) => {
                                // await for something then call next()
                                let res;
                                res = await axios.get("http://localhost:4000/api/ping");
                                console.log(res);
                                next();
                            }}><div className='text-xl'>Valider</div></AwesomeButtonProgress>
                        </div>
                    </div>
                </Popup>
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
                {this.state.isBusy ? <GridLoader color='#AAAAAA' /> : <>{this.state.tableData.length > 0 ? <Table columns={this.columns} data={this.state.tableData} rowKey="roid" /> : <p>Aucun Ordre de Réparation à Afficher...</p>}</>}
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
        // console.log("DATA = " + JSON.stringify(ParamTableData));
        this.setState({ tableData: ParamTableData });
    }

    searchTimeOut = null;

    SearchFieldOnChange(ParamEvent) {

        if (this.searchTimeOut != null)
            clearTimeout(this.searchTimeOut);

        this.searchTimeOut = setTimeout(() => { this.GetRepairOrdersListFromDB(ParamEvent.target.value) }, 500);
    }
}