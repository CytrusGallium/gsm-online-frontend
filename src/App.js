import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import Dashboard from './components/Dashboard';
import RepairOrderEditor from './pages/RepairOrderEditor';
import ConnexionSettings from './pages/ConnexionSettings';
import RepairOrdersList from './pages/RepairOrdersList';
import { IsLoggedIn, Logout } from './LoginManager';
import PleaseLogin from './components/PleaseLogin';
import { FaUserAlt } from 'react-icons/fa';
import AppData from './App.json';
import ProductEditor from './pages/ProductEditor';
import CateringSalesPoint from './pages/CateringSalesPoint';
import logo from './Logo.png'; // relative path to image 
import Config from './pages/Config';
import CategoryEditor from './pages/CategoryEditor';
import ProductList from './pages/ProductList';
import CateringSalesList from './pages/CateringSalesList';
import Statistics from './pages/Statistics';
import UserManager from './pages/UserManager';
import ReceptionList from './pages/ReceptionList';
import ReceptionEditor from './pages/ReceptionEditor';
import ProviderList from './pages/ProviderList';
import ProviderEditor from './pages/ProviderEditor';
import EmployeeManager from './pages/EmployeeManager';
import EmployeeClockingBoard from './pages/EmployeeClockingBoard';
import FeeManager from './pages/FeeManager';
import SalesPoint from './pages/SalesPoint';
import { Link } from 'react-router-dom';
import DatabaseManager from './pages/DatabaseManager';

function App() {

  useEffect(() => {

    console.log("Reaknotron Online !");

    // ==========================================================================



    // ==========================================================================

    function handleError(ParamEvent) {
      console.log("ERROR : " + JSON.stringify(ParamEvent));
    }

    window.addEventListener("error", handleError);

    // ==========================================================================

    return () => window.removeEventListener("error", handleError);

  }, []);

  return (
    <div className="App">



      {/* <div className='container'> */}
      <div className='mt-16' id='app-module-container'>
        <BrowserRouter>

          <nav className='px-2 sm:px-4 py-2.5 bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600 h-16'>
            <h1 className="text-gray-100 font-bold text-3xl text-left ml-12 opacity-50 hover:opacity-90">
              <Link to='/Dashboard' className='' >{AppData.company_label}</Link>
            </h1>
            <img src={logo} className='absolute left-4 top-2 w-8 w-8'></img>
            {IsLoggedIn() && <a href='/'><FaUserAlt className='absolute right-4 top-4 cursor-pointer' color='#CCCCCC' size={24} onClick={Logout} /></a>}
          </nav>

          <Routes>
            <Route path='/' element={<LoginForm />} />
            <Route path='/connexion-settings' element={<ConnexionSettings />} />
            <Route path='/dashboard' element={IsLoggedIn() ? <Dashboard /> : <PleaseLogin />} />

            {AppData.SALES_POINT_FLAG && <Route path='/sales-point' element={IsLoggedIn() ? <SalesPoint /> : <PleaseLogin />} />}

            {AppData.DEVICE_MAINTENANCE_FLAG && <Route path='/add-repair-order' element={IsLoggedIn() ? <RepairOrderEditor /> : <PleaseLogin />} />}
            {AppData.DEVICE_MAINTENANCE_FLAG && <Route path='/repair-orders-list' element={IsLoggedIn() ? <RepairOrdersList /> : <PleaseLogin />} />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/product-editor' element={IsLoggedIn() ? <ProductEditor /> : <PleaseLogin />} />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/product-list' element={IsLoggedIn() ? <ProductList /> : <PleaseLogin />} />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/new-category' element={IsLoggedIn() ? <CategoryEditor /> : <PleaseLogin />} />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/provider-list' element={IsLoggedIn() ? <ProviderList /> : <PleaseLogin />} />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/provider-editor' element={IsLoggedIn() ? <ProviderEditor /> : <PleaseLogin />} />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/reception-list' element={IsLoggedIn() ? <ReceptionList /> : <PleaseLogin />} />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <Route path='/reception-editor' element={IsLoggedIn() ? <ReceptionEditor /> : <PleaseLogin />} />}

            {AppData.CATERING_FLAG && <Route path='/catering-sales-point' element={IsLoggedIn() ? <CateringSalesPoint /> : <PleaseLogin />} />}
            {AppData.CATERING_FLAG && <Route path='/catering-sales-list' element={IsLoggedIn() ? <CateringSalesList /> : <PleaseLogin />} />}

            {AppData.EMPLOYEE_MANAGEMENT_FLAG && <Route path='/employee-manager' element={IsLoggedIn() ? <EmployeeManager /> : <PleaseLogin />} />}
            {AppData.EMPLOYEE_MANAGEMENT_FLAG && <Route path='/employee-clocking-board' element={IsLoggedIn() ? <EmployeeClockingBoard /> : <PleaseLogin />} />}

            {AppData.FEE_MANAGEMENT_FLAG && <Route path='/fee-manager' element={IsLoggedIn() ? <FeeManager /> : <PleaseLogin />} />}

            <Route path='/statistics' element={IsLoggedIn() ? <Statistics /> : <PleaseLogin />} />
            <Route path='/user-manager' element={IsLoggedIn() ? <UserManager /> : <PleaseLogin />} />
            <Route path='/config' element={IsLoggedIn() ? <Config /> : <PleaseLogin />} />
            <Route path='/db-manager' element={IsLoggedIn() ? <DatabaseManager /> : <PleaseLogin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;