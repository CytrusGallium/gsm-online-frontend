import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const FeeStats = (props) => {

    // Effects
    useEffect(() => {

        GetFeeStatsFromDB();

    }, [props]);

    // States
    const [total, setTotal] = useState(0);
    const [chartData, setChartData] = useState(null);

    const GetFeeStatsFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            let url;

            if (props.start && props.end)
                url = GetBackEndUrl() + "/api/get-fee-stats?start=" + props.start.toISOString() + "&end=" + props.end.toISOString();
            else
                url = GetBackEndUrl() + "/api/get-fee-stats";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // Update
                setTotal(res.data.total);
                setChartData(res.data.totalPerFeeTypeReady);
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
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Frai(s) Par Type</h4>
            <br />
            {chartData &&
                <div className='w-4/5 border-2 border-gray-500 p-4 m-1 bg-gray-900 text-gray-100'>
                    {/* Header */}
                    <div className='w-full flex flex-row'>
                        <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Type de Frai</div>
                        <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Montant</div>
                        <div className='inline w-1/3 bg-gray-900 m-0.5 p-1 rounded-lg font-bold border border-gray-500'>Pourcentage</div>
                    </div>
                    {/* Rows */}
                    {chartData.map((f, index) =>
                        <div className='w-full flex flex-row' key={index}>
                            <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{f.key}</div>
                            <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{f.data}</div>
                            <div className='inline w-1/3 bg-gray-700 m-0.5 p-1 rounded-lg'>{((f.data / total) * 100).toFixed(2) + " %"}</div>
                        </div>
                    )}
                </div>
            }
            <br />
            {chartData && <BarChart
                width="90vw"
                height={256}
                data={chartData}
            />}
            <br />
            <br />
        </div>
    )
}

export default FeeStats