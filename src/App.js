import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import NewRepairOrderForm from './components/NewRepairOrderForm';
import ConnexionSettings from './pages/ConnexionSettings';
import RepairOrdersList from './pages/RepairOrdersList';

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold border-2 m-8 flex space-x-3 mr-2 font-semibold 
        bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 
        text-gray-100 rounded-sm ring-2 ring-gray-200 px-6 py-2 mx-8">
        GSM Online
      </h1>
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginForm />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/add-repair-order' element={<NewRepairOrderForm />} />
            <Route path='/connexion-settings' element={<ConnexionSettings />} />
            <Route path='/repair-orders-list' element={<RepairOrdersList />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;