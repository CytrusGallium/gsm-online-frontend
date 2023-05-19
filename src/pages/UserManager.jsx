import React, { useState, useEffect } from 'react';
import Table from 'rc-table';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { InputFieldStyle } from '../Styles';
import { AwesomeButton } from 'react-awesome-button';

const UserManager = () => {

  useEffect(() => {

    GetUserListFromDB();

  }, []);

  const [tableData, setTableData] = useState();
  const [username, setUsername] = useState("");
  const [password_1, setPassword_1] = useState("");
  const [password_2, setPassword_2] = useState("");
  const [level, setLevel] = useState("NOTHING");

  const columns = [
    {
      title: "Nom d'Utilisateur",
      dataIndex: 'username',
      key: 'username',
      width: 256,
      className: 'border border-gray-500'
    },
    {
      title: 'Role',
      dataIndex: 'level',
      key: 'level',
      width: 256,
      className: 'border border-gray-500'
    }
  ];

  const GetUserListFromDB = async () => {
    let res;

    try {

      // Build Req/Res
      var url = GetBackEndUrl() + "/api/get-user-list";

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
    ParamQueryResult.forEach(u => {
      result.push({ id: u._id, username: u.username, level: UserLevelCodeToLabel(u.level) });
    });
    setTableData(result);
  }

  const UserLevelCodeToLabel = (ParamCode) => {
    if (ParamCode == "ADMIN") {
      return "Administrateur";
    } else if (ParamCode == "NOTHING") {
      return "Aucun";
    } else if (ParamCode == "MANAGER") {
      return "Gérant";
    } else if (ParamCode == "EMPLOYEE") {
      return "Employé";
    } else {
      return "?";
    }
  }

  const handleUsernameOnChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePassword1OnChange = (e) => {
    setPassword_1(e.target.value);
  }

  const handlePassword2OnChange = (e) => {
    setPassword_2(e.target.value);
  }

  const handleLevelOnChange = (e) => {
    setLevel(e.target.value);
  }

  const AddUserToDB = async () => {
    try {

      let userToPost = {
        username: username,
        password: password_1,
        level: level
      };

      // Add token
      // const token = localStorage.getItem("token");
      // const config = {
      //     headers: { Authorization: `Bearer ${token}` }
      // };

      const url = GetBackEndUrl() + "/api/new-user";
      console.log("POST : " + url);

      let res = await axios.post(url, userToPost);

      if (res) {
        setUsername("");
        setPassword_1("");
        setPassword_2("");
      }

    } catch (error) {
      console.log("ERROR : " + error);
    }
  }

  return (
    <div>
      <br />
      <h3 className='text-3xl font-bold text-gray-100'>Gestion des Utilisateurs</h3>
      <br />
      <div className='flex flex-col items-center text-gray-100 m-4'>

        {/* List */}
        <div className='border-4 border-gray-500 rounded-3xl w-full m-4 p-2 flex flex-col items-center'>
          <h3 className='text-xl font-bold mt-2'>Liste des Utilisateurs</h3>
          <br />
          <Table columns={columns} data={tableData} rowKey="id" className='mx-4' />
          <br />
        </div>

        {/* Add New User */}
        <div className='border-4 border-gray-500 rounded-3xl w-full m-4 p-2 flex flex-col items-center'>
          <h3 className='text-xl font-bold mt-2'>Créer Un Utilisateur</h3>
          <br />
          <input type='text' className={InputFieldStyle} placeholder="Nom d'Utilisateur..." onChange={handleUsernameOnChange} value={username} />
          <input type='password' className={InputFieldStyle} placeholder="Mot de Passe..." onChange={handlePassword1OnChange} value={password_1} />
          <input type='password' className={InputFieldStyle} placeholder="Confirmation du Mot de Passe..." onChange={handlePassword2OnChange} value={password_2} />
          <label className='mt-2 text-sm' >Privilège</label>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-1 mx-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={level} onChange={handleLevelOnChange}>
                <option value="ADMIN">Administrateur</option>
                <option value="MANAGER">Gérant</option>
                <option value="EMPLOYEE">Employé</option>
                <option value="NOTHING">Aucun</option>
            </select>
          <br />
          {username && password_1 && password_1 == password_2 && <AwesomeButton onPress={AddUserToDB} >Confirmer</AwesomeButton>}
          <br />
        </div>

      </div>
    </div>
  )
}

export default UserManager