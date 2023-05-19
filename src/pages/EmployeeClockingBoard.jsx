import React, { useState, useEffect } from 'react';
import { InputFieldStyle } from '../Styles';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { AwesomeButton } from 'react-awesome-button';

const EmployeeClockingBoard = () => {

    useEffect(() => {

        GetEmployeeListFromDB();
        GetEventListFromDB();

    }, []);

    // var employeeDictionary = {};

    const GetEmployeeListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-employee-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log(res.data);
                // UpdateTableData(res.data);
                var tmpEmployeeDictionary = {};
                res.data.forEach(e => {
                    tmpEmployeeDictionary[e._id] = e.firstName + " " + e.familyName;
                });
                // console.log("ED = " + JSON.stringify(tmpEmployeeDictionary));
                setEmployeeDictionary(tmpEmployeeDictionary);
                setEmployeeList(res.data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetEventListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-employee-clocking-event-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log(res.data);
                UpdateTableData(res.data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const UpdateTableData = (ParamQueryResult) => {
        let result = [];
        ParamQueryResult.forEach(e => {
            result.push({
                id: e._id,
                employee: e.employeeID,
                eventType: e.type,
                time:e.time
            });
            setTableData(result);
        });
    }

    const columns = [
        {
            title: "Employé",
            dataIndex: 'employee',
            key: 'employee',
            width: 256,
            className: 'border border-gray-500',
            render: e => <p className='inline text-sm'>{employeeDictionary[e]}</p>
        },
        {
            title: 'Evenement',
            dataIndex: 'eventType',
            key: 'eventType',
            width: 256,
            className: 'border border-gray-500',
            render: t => <p className='inline text-sm'>{t == "ENTRY" && "Entrée"}{t == "EXIT" && "Sortie"}</p>
        },
        {
            title: 'Date et Heure',
            dataIndex: 'time',
            key: 'time',
            width: 256,
            className: 'border border-gray-500',
            render: d => <p className='inline text-sm'>{(new Date(d)).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        }
    ];

    const [tableData, setTableData] = useState([]);
    const [employee, setEmployee] = useState("");
    const [CET, setCET] = useState("ENTRY");
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeDictionary, setEmployeeDictionary] = useState({});

    const handleEmployeeChange = (e) => {
        setEmployee(e.target.value);
    }

    const handleEventTypeChange = (e) => {
        setCET(e.target.value);
    }

    const handlePerformEvent = (e) => {
        if (CET != "" && CET != "NULL" && employee != "" && employee != "NULL") {
            console.log("CLOCKING EVENT");
            PerformEventInDB();
        }
    }

    const PerformEventInDB = async () => {
        try {

            let eventToPost = {
                employeeID: employee,
                type: CET
            };

            // Add token
            // const token = localStorage.getItem("token");
            // const config = {
            //     headers: { Authorization: `Bearer ${token}` }
            // };

            const url = GetBackEndUrl() + "/api/new-employee-clocking-event";
            console.log("POST : " + url);

            let res = await axios.post(url, eventToPost);

            if (res) {
                console.log("RESULT = " + res.data.message);
                GetEventListFromDB();
            }

        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    return (
        <div className='text-gray-100 flex flex-col items-center'>
            <br />
            <div className='border-4 border-gray-500 rounded-xl m-4 p-2'>
                <br />
                <h3 className='text-3xl font-bold'>Effectuer Un Pointage</h3>
                <br />
                <label className='text-sm'>Employé</label>
                <br />
                <select name="employee" className={InputFieldStyle} value={employee} onChange={handleEmployeeChange}>
                    <option value="NULL" defaultValue>Aucune</option>
                    {employeeList.map((employee, index) => (
                        <option key={index} value={employee._id}>
                            {employee.firstName + " " + employee.familyName}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <label className='text-sm'>Type de Pointage</label>
                <br />
                <select name="type" className={InputFieldStyle} value={CET} onChange={handleEventTypeChange}>
                    <option value="ENTRY">Entrée</option>
                    <option value="EXIT">Sortie</option>
                </select>
                <br />
                <br />
                <AwesomeButton type={(CET != "" && CET != "NULL" && employee != "" && employee != "NULL") ? 'primary' : 'disabled'} onPress={handlePerformEvent} >Effectuer Le Pointage</AwesomeButton>
            </div>
            <br />
            <div className='border-4 border-gray-500 rounded-xl m-4 p-2'>
                <br />
                <h3 className='text-3xl font-bold'>Liste des Pointage</h3>
                <br />
                <Table columns={columns} data={tableData} rowKey="id" className='mx-4' />
                <br />
            </div>
        </div>
    )
}

export default EmployeeClockingBoard