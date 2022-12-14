import React from 'react';
import { FaUserFriends, FaClipboardList, FaList, FaBox, FaShoppingCart, FaCog, FaTag } from 'react-icons/fa';

const Dashboard = () => {
  
  const buttonStyling = `flex space-x-3 mx-8 font-semibold bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-600 
  text-gray-100 rounded-sm ring-2 ring-blue-200 px-6 py-2 
  hover:bg-white  hover:text-white hover:ring-slate-300 mx-8`;
  
  return (
    <div>
      <div className='flex flex-col'>
        {/* <h3 className={buttonStyling}><a href='/add-repair-order' className='text-xl'><FaClipboardList className='inline' size={24}/> Ajouter un Ordre de Réparation</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/repair-orders-list' className='text-xl'><FaList className='inline' size={24}/> Liste des Ordres de Répartion</a></h3>
        <br/> */}
        <h3 className={buttonStyling}><a href='/new-product' className='text-xl'><FaBox className='inline' size={24}/> Ajouter un Produit</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/new-category' className='text-xl'><FaTag className='inline' size={24}/> Ajouter une Categorie</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/sales-point' className='text-xl'><FaShoppingCart className='inline' size={24}/> Point de Vente</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/user-manager' className='text-xl'><FaUserFriends className='inline' size={24}/> Gestion des Utilisateurs</a></h3>
        <br/>
        <h3 className={buttonStyling}><a href='/config' className='text-xl'><FaCog className='inline' size={24}/> Configuration</a></h3>
        <br/>
      </div>
    </div>
  )
}

export default Dashboard