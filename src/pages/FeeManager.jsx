import React, { useState, useEffect } from 'react';
import { GetBackEndUrl } from '../const';
import axios from 'axios';
import { InputFieldStyle } from '../Styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus } from 'react-icons/fa';
import AddNewFeeTypePopup from '../components/AddNewFeeTypePopup';
import Table from 'rc-table';

const FeeManager = () => {

    useEffect(() => {

        GetFeeTypeListFromDb();
        GetFeeListFromDb();

    }, []);

    const [feeType, setFeeType] = useState("NULL");
    const [feeTypeList, setFeeTypeList] = useState([]);
    const [feeList, setFeeList] = useState([]);
    const [time, timeOnChange] = useState(new Date());
    const [designation, setDesignation] = useState("");
    const [amount, setAmount] = useState(0);
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [newFeeTypePopupOpen, setNewFeeTypePopupOpen] = useState(false);

    const columns = [
        {
            title: 'Designation',
            dataIndex: 'name',
            key: 'name',
            className: 'border border-gray-500',
            width: 256
        },
        {
            title: 'Type',
            dataIndex: 'feeTypeID',
            key: 'feeTypeID',
            className: 'border border-gray-500',
            width: 256,
            render: ft => <p className='inline text-sm'>{ft[0] && ft[0].name}</p>
        },
        {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            width: 196,
            className: 'border border-gray-500',
            render: d => <p className='inline text-sm'>{d ? (new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "-"}</p>
        },
        {
            title: 'Montant',
            dataIndex: 'amount',
            key: 'amount',
            width: 128,
            className: 'border border-gray-500'
        }
    ];

    const feeTypeOnChange = (e) => {
        setFeeType(e.target.value);
        setChangesAvailable(true);
    }

    const newFeeTypeWindowOnClose = () => {
        setNewFeeTypePopupOpen(false);
        GetFeeTypeListFromDb();
    }

    const GetFeeTypeListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-fee-type-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                setFeeTypeList(res.data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetFeeListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-fee-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log(JSON.stringify(res.data));
                setFeeList(res.data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const AddFeeOnClick = async () => {
        try {
            let feeToPost = { time: time, feeTypeID: feeType, name: designation, amount: amount };
            let url = GetBackEndUrl() + "/api/add-fee";
            console.log("POST : " + url);
            let res = await axios.post(url, feeToPost);
            if (res) {
                setFeeType("NULL");
                setDesignation("");
                setAmount(0);
                setChangesAvailable(false);
            }
        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    return (
        <div className='text-gray-100'>
            <br />
            <h3 className='font-bold text-3xl'>Gestion des Frais</h3>
            <br />

            {/* Popup */}
            <AddNewFeeTypePopup isOpen={newFeeTypePopupOpen} onClose={newFeeTypeWindowOnClose} />

            {/* Add New Fee*/}
            <div className='border-4 border-gray-500 rounded m-4 p-2'>

                <h3 className='font-bold text-xl'>Ajouter un Frai</h3>
                <br />
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2">Type</label>
                <br />
                <select name="feeType" className={InputFieldStyle} value={feeType} onChange={(feeTypeOnChange)}>
                    <option value="NULL" defaultValue>Aucun</option>
                    {feeTypeList.map((ft, index) => (
                        <option key={index} value={ft._id}>
                            {ft.name}
                        </option>
                    ))}
                </select>
                <div className='inline opacity-50 hover:opacity-100 mx-2 text-3xl'><AwesomeButton type='primary' onPress={() => setNewFeeTypePopupOpen(true)}><span className='font-bold text-3xl mb-1'>+</span></AwesomeButton></div>
                <br />

                <br />
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Date</label>
                <DatePicker className='inline text-gray-100 bg-gray-700 rounded-lg p-1' selected={time} onChange={timeOnChange} />
                <br />

                <br />
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Designation</label>
                <br />
                <input type='text' className={InputFieldStyle} value={designation} onChange={(e) => setDesignation(e.target.value)} />
                <br />

                <br />
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Montant</label>
                <br />
                <input type='number' className={InputFieldStyle} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <br />
                <br />
                <AwesomeButton before={<FaPlus />} onPress={AddFeeOnClick} >Ajouter</AwesomeButton>
                <br />
                <br />
            </div>

            {/* Fee List */}
            <div className='border-4 border-gray-500 rounded m-4 p-2 flex flex-col items-center'>
                <h3 className='font-bold text-xl'>Liste des Frais</h3>
                <br/>
                <Table columns={columns} data={feeList} rowKey="_id" />
            </div>

        </div>
    )
}

export default FeeManager