import React from 'react';
import { FaUserFriends, FaClipboardList, FaList } from 'react-icons/fa';

const Dashboard = () => {
  
  const buttonStyling = `flex space-x-3 mr-2 font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
  text-gray-100 rounded-sm ring-2 ring-blue-200 px-6 py-2 
  hover:bg-white  hover:text-white hover:ring-slate-300 mx-8`;
  
  return (
    <div>
      <div className='flex flex-col'>
        <h3 className={buttonStyling}><a href='/add-repair-order'><FaClipboardList />Ajouter un Ordre de Réparation</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/repair-orders-list'><FaList />Liste des Ordres de Répartion</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/user-manager'><FaUserFriends />Gestion des Utilisateur</a></h3>
      </div>
    </div>
  )
}

export default Dashboard