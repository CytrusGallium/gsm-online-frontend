import React, { useEffect, useState, useRef } from 'react';
import { GridLoader } from 'react-spinners';
import axios from "axios";
import { GetBackEndUrl } from '../const';
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
import { FaSearch, FaFileExcel, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import RepairOrderValidationPopupV2 from '../components/RepairOrderValidationPopupV2';
import RknConfirmationPopup from '../components/RknUI/RknConfirmationPopup';
import RknLoaderPopup from '../components/RknUI/RknLoaderPopup';

const RepairOrdersList = () => {

    const [tableData, setTableData] = useState([]);
    const [busy, setBusy] = useState(false);
    const [validationWindowOpen, setValidationWindowOpen] = useState(false);
    const [currentValidationRepairOrder, setCurrentValidationRepairOrder] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [page, setPage] = useState(0);
    const [roidInputValue, setRoidInputValue] = useState("");
    const [customerInputValue, setCustomerInputValue] = useState("");
    const [phoneInputValue, setPhoneInputValue] = useState("");
    const [imeiInputValue, setImeiInputValue] = useState("");
    const [roToDelete, setRoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const checkboxRef = useRef(null);

    useEffect(() => {
        GetRepairOrdersListFromDB();
    }, [page]);

    const GetRepairOrdersListFromDB = async (ParamSearchProperty, ParamSearchProbe) => {

        setBusy(true);
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-repair-orders-list?page=" + page;

            if (ParamSearchProbe && ParamSearchProbe.length > 1)
                url += `&${ParamSearchProperty}=` + ParamSearchProbe;

            // Show Deleted ?
            if (checkboxRef.current.checked)
                url += "&showDeleted=true";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // this.UpdateTableData(res.data);
                setTableData(res.data);
                setBusy(false);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const popupOnClose = () => {
        setValidationWindowOpen(false);
        setCurrentValidationRepairOrder("");
        GetRepairOrdersListFromDB();
    }

    const DeleteRepairOrderFromDB = async (ParamROID) => {

        setDeleting(true);
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/delete-repair-order?roid=" + ParamROID;

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                GetRepairOrdersListFromDB("", "");
            }

            setDeleting(false);

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    var searchTimeOut = null;

    const RoidSearchFieldOnChange = (ParamEvent) => {

        setRoidInputValue(ParamEvent.target.value);

        if (searchTimeOut != null)
            clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(() => { GetRepairOrdersListFromDB("roid", ParamEvent.target.value) }, 500);
    }

    const CustomerSearchFieldOnChange = (ParamEvent) => {

        setCustomerInputValue(ParamEvent.target.value);

        if (searchTimeOut != null)
            clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(() => { GetRepairOrdersListFromDB("customer", ParamEvent.target.value) }, 500);
    }

    const PhoneSearchFieldOnChange = (ParamEvent) => {

        setPhoneInputValue(ParamEvent.target.value);

        if (searchTimeOut != null)
            clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(() => { GetRepairOrdersListFromDB("phone", ParamEvent.target.value) }, 500);
    }

    const IMEISearchFieldOnChange = (ParamEvent) => {

        setImeiInputValue(ParamEvent.target.value);

        if (searchTimeOut != null)
            clearTimeout(searchTimeOut);

        searchTimeOut = setTimeout(() => { GetRepairOrdersListFromDB("imei", ParamEvent.target.value) }, 500);
    }

    const handleShowDeletedChange = () => {
        setShowDeleted(!showDeleted);

        setTimeout(() => {
            GetRepairOrdersListFromDB();
        }, 100);

        // console.log(checkboxRef.current.checked);
    };

    return (
        <div className='text-gray-100 flex flex-col items-center'>
            <br />
            <h2 className='font-bold text-2xl mb-2' >Liste des Ordres de Réparation</h2>
            {IsAdmin() && <a href={GetBackEndUrl() + "/api/get-ro-list-xls"} target="_blank" className='text-xs text-gray-400 bg-gray-800 border border-gray-400 p-1 rounded-lg m-1 hover:text-gray-100 hover:border-gray-100'> <FaFileExcel className='inline mb-1' /> Télécharger Fichier Excel</a>}
            <br />
            <br />
            <div>
                <FaSearch className='hidden md:inline' size={24} />
                <input type="text" value={roidInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => RoidSearchFieldOnChange(e)} placeholder="Identifiant du bon..." />
                <input type="text" value={customerInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => CustomerSearchFieldOnChange(e)} placeholder="Nom du client..." />
                <input type="text" value={phoneInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => PhoneSearchFieldOnChange(e)} placeholder="N° de Téléphone..." />
                <input type="text" value={imeiInputValue} className='inline rounded p-2 text-black mx-2' onChange={e => IMEISearchFieldOnChange(e)} placeholder="IMEI/NS..." />
            </div>
            <br />
            <label className='mb-2 text-gray-100 text-sm'>
                <input type="checkbox" checked={showDeleted} onChange={handleShowDeletedChange} className='mx-1 w-3 h-3' ref={checkboxRef} />Afficher les Ordres de Réparations Supprimées
            </label>
            <br />

            {busy && <GridLoader color='#AAAAAA' />}

            {!busy && tableData && <RepairOrdersTable
                items={tableData}
                onValidationClick={(ParamRepairOrder) => {
                    setValidationWindowOpen(true);
                    setCurrentValidationRepairOrder(ParamRepairOrder);
                }}
                // onDeleteClick={(ParamRepairOrder) => { DeleteRepairOrderFromDB(ParamRepairOrder.roid) }}
                onDeleteClick={(ParamRepairOrder) => { setRoToDelete(ParamRepairOrder.roid) }}
            />}

            <br />
            <div className='flex flex-row'>
                <FaArrowLeft className='inline p-1 border border-gray-500 bg-gray-900 mr-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer' size={24} onClick={() => { setPage(page - 1); }} />
                <p className='inline'>Page {page + 1}</p>
                <FaArrowRight className='inline p-1 border border-gray-500 bg-gray-900 ml-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer' size={24} onClick={() => { setPage(page + 1); }} />
            </div>
            <br />

            {validationWindowOpen && <RepairOrderValidationPopupV2 value={currentValidationRepairOrder} isOpen={validationWindowOpen} onClose={() => { popupOnClose() }} />}
            {roToDelete && <RknConfirmationPopup danger={true} onConfirm={() => { DeleteRepairOrderFromDB(roToDelete); setRoToDelete(null); }} onCancel={() => { setRoToDelete(null); }} />}
            {deleting && <RknLoaderPopup loader='pacman' />}
        </div>
    )
}

export default RepairOrdersList