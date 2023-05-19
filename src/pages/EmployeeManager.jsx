import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { InputFieldStyle } from '../Styles';
import { AwesomeButton } from 'react-awesome-button';

const EmployeeManager = () => {

    useEffect(() => {

        GetEmployeeListFromDB();

    }, []);

    const [tableData, setTableData] = useState();
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");

    const columns = [
        {
            title: "Prénom",
            dataIndex: 'firstName',
            key: 'firstName',
            width: 256,
            className: 'border border-gray-500'
        },
        {
            title: 'Nom',
            dataIndex: 'familyName',
            key: 'familyName',
            width: 256,
            className: 'border border-gray-500'
        }
    ];

    const GetEmployeeListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-employee-list";

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
        ParamQueryResult.forEach(employee => {
            result.push({
                id: employee._id,
                firstName: employee.firstName,
                familyName: employee.familyName
            });
            setTableData(result);
        });
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleFamilyNameChange = (e) => {
        setFamilyName(e.target.value);
    }

    const AddEmployeeToDB = async () => {
        try {

            let userToPost = {
                firstName: firstName,
                familyName: familyName
            };

            // Add token
            // const token = localStorage.getItem("token");
            // const config = {
            //     headers: { Authorization: `Bearer ${token}` }
            // };

            const url = GetBackEndUrl() + "/api/new-employee";
            console.log("POST : " + url);

            let res = await axios.post(url, userToPost);

            if (res) {
                setFirstName("");
                setFamilyName("");
                GetEmployeeListFromDB();
            }

        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    return (
        <div>
            <br />
            <h3 className='text-3xl font-bold text-gray-100'>Gestion des Employés</h3>
            <br />
            <div className='flex flex-col items-center text-gray-100 m-4'>

                {/* Employee List */}
                <div className='border-4 border-gray-500 rounded-3xl w-full m-4 p-2 flex flex-col items-center'>
                    <h3 className='text-xl font-bold mt-2'>Liste des Employés</h3>
                    <br />
                    <Table columns={columns} data={tableData} rowKey="id" className='mx-4' />
                    <br />
                </div>

                {/* Add New Employee */}
                <div className='border-4 border-gray-500 rounded-3xl w-full m-4 p-2 flex flex-col items-center'>
                    <h3 className='text-xl font-bold mt-2'>Créer Un Employé</h3>
                    <br />
                    <input type='text' className={InputFieldStyle} placeholder="Prénom..." onChange={handleFirstNameChange} value={firstName} />
                    <input type='text' className={InputFieldStyle} placeholder="Nom..." onChange={handleFamilyNameChange} value={familyName} />
                    <br />
                    {firstName && familyName && <AwesomeButton onPress={AddEmployeeToDB} >Confirmer</AwesomeButton>}
                    <br />
                </div>

            </div>
        </div>
    )
}

export default EmployeeManager