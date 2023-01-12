import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import Dashboard from './components/Dashboard';
import NewRepairOrderForm from './components/NewRepairOrderForm';
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

function App() {
  return (
    <div className="App">
      <nav className='px-2 sm:px-4 py-2.5 bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600'>
        <h1 className="text-gray-100 font-bold text-3xl text-left ml-12 opacity-50 hover:opacity-90">
          <a href='/Dashboard' className='' >{AppData.company_label}</a>
        </h1>
        <img src={logo} className='absolute left-4 top-2 w-8 w-8'></img>
        {IsLoggedIn() && <a href='/'><FaUserAlt className='absolute right-4 top-4 cursor-pointer' color='#CCCCCC' size={24} onClick={Logout} /></a>}
      </nav>
      <br />
      <br />
      <br />
      {/* <div className='container'> */}
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginForm />} />
            <Route path='/connexion-settings' element={<ConnexionSettings />} />
            <Route path='/dashboard' element={IsLoggedIn() ? <Dashboard /> : <PleaseLogin />} />
            <Route path='/add-repair-order' element={IsLoggedIn() ? <NewRepairOrderForm /> : <PleaseLogin />} />
            <Route path='/repair-orders-list' element={IsLoggedIn() ? <RepairOrdersList /> : <PleaseLogin />} />
            <Route path='/product-editor' element={IsLoggedIn() ? <ProductEditor /> : <PleaseLogin />} />
            <Route path='/product-list' element={IsLoggedIn() ? <ProductList /> : <PleaseLogin />} />
            <Route path='/new-category' element={IsLoggedIn() ? <CategoryEditor /> : <PleaseLogin />} />
            <Route path='/sales-point' element={IsLoggedIn() ? <CateringSalesPoint /> : <PleaseLogin />} />
            <Route path='/config' element={IsLoggedIn() ? <Config /> : <PleaseLogin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;