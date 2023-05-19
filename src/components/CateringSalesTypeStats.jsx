import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const CateringSalesTypeStats = (props) => {

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, [props]);

    // States
    const [locationChartData, setLocationChartData] = useState(null);
    const [revenueChartData, setRevenueChartData] = useState(null);

    const GetCateringOrdersListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            let url;

            if (props.start && props.end)
                url = GetBackEndUrl() + "/api/get-catering-orders-list?start=" + props.start.toISOString() + "&end=" + props.end.toISOString();
            else
                url = GetBackEndUrl() + "/api/get-catering-orders-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res.data));

                let locationStats = { sitting: 0, takeout: 0 };
                let revenueStats = { sitting: 0, takeout: 0 };
                res.data.forEach(sale => {
                    if (sale.consumedProducts && sale.finalized) {
                        if (sale.table && sale.table[0]) {
                            locationStats.sitting++;
                            revenueStats.sitting += sale.totalPrice;
                        }
                        else {
                            locationStats.takeout++;
                            revenueStats.takeout += sale.totalPrice;
                        }
                    }
                });

                const locationData = [
                    { key: 'Installé', data: locationStats.sitting },
                    { key: 'Emporté', data: locationStats.takeout }
                ];

                const revenueData = [
                    { key: 'Installé', data: revenueStats.sitting },
                    { key: 'Emporté', data: revenueStats.takeout }
                ];

                // Update
                setLocationChartData(locationData);
                setRevenueChartData(revenueData);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Vente(s) par type</h4>
            <br />
            <div className='flex flex-row'>
                <div>
                    <h4 className='text-gray-300 font-bold'>Nombre de vente(s)</h4>
                    <br/>
                    {locationChartData && <BarChart
                        width="20vw"
                        height="30vh"
                        data={locationChartData}
                    />}
                </div>
                <div>
                    <h4 className='text-gray-300 font-bold'>Revenue des ventes</h4>
                    <br/>
                    {revenueChartData && <BarChart
                        width="20vw"
                        height="30vh"
                        data={revenueChartData}
                    />}
                </div>

            </div>
            <br />
            <br />
        </div>
    )
}

export default CateringSalesTypeStats