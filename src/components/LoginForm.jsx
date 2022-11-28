import React from 'react';
import { useState } from 'react';
import axios from "axios";
import GetBackEndUrl from '../const';

const LoginForm = () => {
  
    const [ loginInfo, setLoginInfo ] = useState( { username:"", password:"" } );
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setLoginInfo({...loginInfo, [input.name]: input.value });
    }

    const LoginOnClick = async (event) => {
        
        event.preventDefault();
        let res;
        
        try {
            
            // Build Req/Res
            const url = GetBackEndUrl() + "/api/login";
            res = await axios.post(url, loginInfo);

            if (res.data["token"])
            {
                localStorage.setItem("token", res.data["token"]);
                setErrorMessage("Welcome !");
                window.location = "/Dashboard";
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                
                console.log(error.response.data);
                
                if (error.response.data["code"] === "USER_NOT_FOUND")
                    setErrorMessage("Utilisateur Introuvables :(");
                    
                if (error.response.data["code"] === "INCORRECT_PASSWORD")
                    setErrorMessage("Mot de Passe Incorrect :(");
            }
        }
        
    }

    return (
        <div>
            <form onSubmit={LoginOnClick}>
            <div>
                <input type="text" name="username" placeholder="Nom d'Utilisateur..." value={loginInfo.username} onChange={handleChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
            </div>
            <br/>
            <div>
                <input type="password" name="password" placeholder="Mot de passe..." value={loginInfo.password} onChange={handleChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
            </div>
            <br/>
            <div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Se Connecter</button>
            </div>
            </form>
            <br/>
            <p className='text-gray-100'>{errorMessage}</p>
        </div>
    )
}

export default LoginForm