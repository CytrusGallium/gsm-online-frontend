import React from 'react';
import axios from "axios";
import { GetBackEndUrl } from '../const';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';
import { FaCog } from 'react-icons/fa';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { Login } from '../LoginManager';

const LoginForm = () => {

    const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
    const [uiMessage, setUIMessage] = useState("");
    const [isBusy, setIsBusy] = useState(false);

    const handleChange = ({ currentTarget: input }) => {
        setLoginInfo({ ...loginInfo, [input.name]: input.value });
    }

    const LoginOnClick = async (event) => {

        setIsBusy(true);
        event.preventDefault();
        let res;

        setUIMessage("Connexion en cours...");

        try {

            // Build Req/Res
            const url = GetBackEndUrl() + "/api/login";
            console.log("Login URL = " + url);
            res = await axios.post(url, loginInfo);

            if (res.data["token"]) {
                // localStorage.setItem("token", res.data["token"]);
                Login(res.data["token"], res.data["level"]);
                setUIMessage("Bienvenue !");
                window.location = "/Dashboard";
            }

        } catch (error) {
            console.log("ERROR : " + error);
            setIsBusy(false);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

                if (error.response.data["code"] === "USER_NOT_FOUND")
                    setUIMessage("Utilisateur Introuvables :(");
                else if (error.response.data["code"] === "INCORRECT_PASSWORD")
                    setUIMessage("Mot de Passe Incorrect :(");
                else
                    setUIMessage("Impossible de ce connecter :(");
            }
            else
                setUIMessage("Impossible de ce connecter :(");
        }

    }

    const awsBtnStyle = {
        '--button-primary-color': "#111111", // BG
        '--button-primary-color-dark': "#333333", // Shadow
        '--button-primary-color-light': "#CCCCCC", // Text
        '--button-primary-color-hover': "#333333", // Hover BG
        // '--button-secondary-color-active': "#ff0505",
    };

    return (
        <div className='flex flex-col items-center'>
            <br/>
            <form onSubmit={LoginOnClick}>
                <div>
                    <input type="text" name="username" placeholder="Nom d'Utilisateur..." value={loginInfo.username} onChange={handleChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                </div>
                <br />
                <div>
                    <input type="password" name="password" placeholder="Mot de passe..." value={loginInfo.password} onChange={handleChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
                </div>
                <br />
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Se Connecter</button>
                </div>
            </form>
            <br />
            <p className='text-gray-100'>{uiMessage}</p>
            <br />
            {isBusy && <BarLoader color='#AAAAAA' />}
            <br />
            <br />
            <AwesomeButton type="primary" style={awsBtnStyle} before={<FaCog />}><a href='/connexion-settings'>Options de Connexion</a></AwesomeButton>
        </div>
    )
}

export default LoginForm