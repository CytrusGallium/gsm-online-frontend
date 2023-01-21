import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CateringSalesRevenueBarChart from '../components/CateringSalesRevenueBarChart';
import CateringSalesProductCount from '../components/CateringSalesProductCount';

const Statistics = () => {

    const [dateRange, setDateRange] = useState("ALL_TIME");
    const [dateRangeLabel, setDateRangeLabel] = useState("Periode : Depuis Toujours");

    const handleChange = (event) => {
        setDateRange(event.target.value);
        setDateRangeLabel(event.target.value);

        // if (props.onChange)
        //     props.onChange(event.target.value);
    }

    return (
        <div>
            <h3 className='text-3xl font-bold text-gray-100 mb-2' >Statistiques</h3>
            <select name="date-range" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={dateRange} onChange={handleChange}>
                <option value="TODAY">Aujourd'hui</option>
                <option value="YESTERDAY">Hier</option>
                <option value="LAST_24_HOURS">Dernières 24 heures</option>
                <option value="THIS_WEEK">Cette semaine</option>
                <option value="LAST_WEEK">Dernière semaine</option>
                <option value="THIS_MONTH">Ce mois</option>
                <option value="LAST_MONTH">Dernier mois</option>
                <option value="THIS_YEAR">Cette année</option>
                <option value="LAST_YEAR">L'Année dernière</option>
                <option value="ALL_TIME">Depuis toujours</option>
            </select>
            <p className='text-sm text-gray-300 mt-2'>{dateRangeLabel}</p>

            <br/>
            <br/>

            <CateringSalesRevenueBarChart />
            <CateringSalesProductCount />
        </div>
    )
}

export default Statistics