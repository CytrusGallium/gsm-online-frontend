import React, { useState, useEffect } from 'react';
import CateringSalesRevenueStats from '../components/CateringSalesRevenueStats';
import CateringSalesProductCount from '../components/CateringSalesProductCount';
import AppData from '../App.json';
import CateringSalesPaymentPerProduct from '../components/CateringSalesPaymentPerProduct';
import ReceptionTotalCounter from '../components/ReceptionTotalCounter';
import FeeStats from '../components/FeeStats';
import GlobalIncomeOutcomeStats from '../components/GlobalIncomeOutcomeStats';
import { GetDateTimeDMYHM } from '../Reaknotron/Libs/RknTimeTools';
import { StringToDateRange } from '../Reaknotron/Libs/RknTimeRange';
import CateringSalesTypeStats from '../components/CateringSalesTypeStats';
import RepairOrderStats from '../components/RepairOrderStats';

const Statistics = () => {

    const [dateRange, setDateRange] = useState("ALL_TIME");
    const [dateRangeLabel, setDateRangeLabel] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleChange = (event) => {
        setDateRange(event.target.value);
        // setDateRangeLabel(event.target.value);
        const range = StringToDateRange(event.target.value);

        if (event.target.value === "ALL_TIME") {
            setDateRangeLabel("");
            setStartDate(null);
            setEndDate(null);
        }
        else if (range) {
            setDateRangeLabel("Du " + GetDateTimeDMYHM(range.start) + " Au " + GetDateTimeDMYHM(range.end));
            setStartDate(range.start);
            setEndDate(range.end);
        }
        else {
            setDateRangeLabel("Du ? Au ?");
            setStartDate(null);
            setEndDate(null);
        }
    }

    return (
        <div>
            <br />
            <h3 className='text-3xl font-bold text-gray-100 mb-2' >Statistiques</h3>
            <select name="date-range" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={dateRange} onChange={handleChange}>
                <option value="TODAY">Aujourd'hui</option>
                <option value="YESTERDAY">Hier</option>
                <option value="LAST_24_HOURS">Dernières 24 heures</option>
                <option value="THIS_WEEK">Cette semaine</option>
                <option value="LAST_WEEK">Les 7 derniers jours</option>
                <option value="THIS_MONTH">Ce mois-ci</option>
                <option value="LAST_MONTH">Les 30 derniers jours</option>
                <option value="THIS_YEAR">Cette année</option>
                <option value="LAST_YEAR">L'Année dernière</option>
                <option value="ALL_TIME">Depuis toujours</option>
            </select>
            <p className='text-sm text-gray-300 mt-2'>{dateRangeLabel}</p>

            <br />
            <br />

            {AppData.DEVICE_MAINTENANCE_FLAG && <RepairOrderStats start={startDate} end={endDate} />}

            {AppData.CATERING_FLAG && <CateringSalesRevenueStats start={startDate} end={endDate} />}
            {AppData.CATERING_FLAG && <CateringSalesProductCount start={startDate} end={endDate} />}
            {AppData.CATERING_FLAG && <CateringSalesPaymentPerProduct start={startDate} end={endDate} />}
            {AppData.CATERING_FLAG && <CateringSalesTypeStats start={startDate} end={endDate} />}

            {AppData.PRODUCT_MANAGEMENT_FLAG && <ReceptionTotalCounter start={startDate} end={endDate} />}

            {AppData.FEE_MANAGEMENT_FLAG && <FeeStats start={startDate} end={endDate} />}

            {AppData.CATERING_FLAG && <GlobalIncomeOutcomeStats start={startDate} end={endDate} />}
            <br />
            <br />
        </div>
    )
}

export default Statistics