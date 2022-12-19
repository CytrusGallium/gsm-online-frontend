import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import NewRepairOrderForm from './components/NewRepairOrderForm';
import ConnexionSettings from './pages/ConnexionSettings';
import RepairOrdersList from './pages/RepairOrdersList';
import { IsLoggedIn, isLoggedIn, Logout } from './LoginManager';
import PleaseLogin from './components/PleaseLogin';
import { FaUserAlt } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
      <nav className='bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600'>
        <h1 className="text-gray-100 font-bold text-3xl text-left">
          <a href='/Dashboard'>GSM Online</a>
        </h1>
        {IsLoggedIn() && <a href='/'><FaUserAlt className='absolute right-4 top-4 cursor-pointer' color='#CCCCCC' size={24} onClick={Logout}/></a>}
      </nav>
      <br />
      <br />
      <br />
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginForm />} />
            <Route path='/connexion-settings' element={<ConnexionSettings />} />
            <Route path='/dashboard' element={IsLoggedIn() ? <Dashboard /> : <PleaseLogin />} />
            <Route path='/add-repair-order' element={IsLoggedIn() ? <NewRepairOrderForm /> : <PleaseLogin />} />
            <Route path='/repair-orders-list' element={IsLoggedIn() ? <RepairOrdersList /> : <PleaseLogin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;