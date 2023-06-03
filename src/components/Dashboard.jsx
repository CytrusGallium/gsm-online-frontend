import React from 'react';
import AppData from '../App.json';
import BackgroundVideo from './BackgroundVideo';
import MainMenuCard from './MainMenuCard';
import { IsAdmin, IsManagerOrHigher, IsEmployeeOrHigher } from '../LoginManager';
import {
  FaUserFriends,
  FaClipboardList,
  FaList,
  FaBox,
  FaShoppingCart,
  FaCog,
  FaTag,
  FaUtensils,
  FaChartBar,
  FaCartPlus,
  FaTruck,
  FaRegClock,
  FaSmile,
  FaFileInvoiceDollar,
  FaCartArrowDown,
  FaDatabase
} from 'react-icons/fa';


const Dashboard = () => {

  const buttonStyling = `flex space-x-3 mx-8 font-semibold bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-600 
  text-gray-100 rounded-sm ring-2 ring-blue-200 px-6 py-2 
  hover:bg-white hover:text-white hover:ring-slate-300 mx-8`;

  // console.log("IS ADMIN ? " + IsAdmin());

  return (
    <div>
      <BackgroundVideo />
      <div>
        <div className='flex'>
          <div className='flex flex-wrap items-center justify-center mx-4 mt-4'>
            {AppData.SALES_POINT_FLAG && <MainMenuCard label="Point de Vente" before={<FaCartArrowDown size={48} />} href='/sales-point' />}

            {AppData.CATERING_FLAG && <MainMenuCard label="Point de Vente" before={<FaShoppingCart size={48} />} href='/catering-sales-point' />}
            {AppData.CATERING_FLAG && <MainMenuCard label="Gestion des Ventes" before={<FaUtensils size={48} />} href='/catering-sales-list' />}

            {AppData.DEVICE_MAINTENANCE_FLAG && <MainMenuCard label="Ajouter un Ordre de Réparation" before={<FaClipboardList size={48} />} href='/add-repair-order' />}
            {AppData.DEVICE_MAINTENANCE_FLAG && <MainMenuCard label="Gestion Des Ordres de Réparation" before={<FaList size={48} />} href='/repair-orders-list' />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Fournisseurs" before={<FaTruck size={48} />} href='/provider-list' />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Réceptions" before={<FaCartPlus size={48} />} href='/reception-list' />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Produits" before={<FaBox size={48} />} href='/product-list' />}
            {AppData.PRODUCT_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Catégories" before={<FaTag size={48} />} href='/new-category' />}

            {AppData.EMPLOYEE_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Employés" before={<FaSmile size={48} />} href='/employee-manager' />}
            {AppData.EMPLOYEE_MANAGEMENT_FLAG && <MainMenuCard label="Pointage Des Employés" before={<FaRegClock size={48} />} href='/employee-clocking-board' />}

            {AppData.FEE_MANAGEMENT_FLAG && <MainMenuCard label="Gestion Des Frais" before={<FaFileInvoiceDollar size={48} />} href='/fee-manager' />}

            {IsAdmin() && <MainMenuCard label="Statistiques" before={<FaChartBar size={48} />} href='/statistics' />}
            {IsAdmin() && <MainMenuCard label="Gestion Des Utilisateurs" before={<FaUserFriends size={48} />} href='/user-manager' />}
            {IsAdmin() && <MainMenuCard label="Configuration" before={<FaCog size={48} />} href='/config' />}
            {IsAdmin() && <MainMenuCard label="Gestion de la Base de Données" before={<FaDatabase size={48} />} href='/db-manager' />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard