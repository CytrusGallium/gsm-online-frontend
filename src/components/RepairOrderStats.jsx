import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const RepairOrderStats = (props) => {

    // Effects
    useEffect(() => {

        GetRoStatsFromDB();

    }, [props]);

    // States
    const [total, setTotal] = useState(0);
    const [totalRoCount, setTotalRoCount] = useState(0);

    const leftCellStyle = 'mt-2';
    const rightCellStyle = 'font-bold bg-gray-700 p-2 rounded-xl';

    const GetRoStatsFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            let url;

            if (props.start && props.end)
                url = GetBackEndUrl() + "/api/ro-stats?start=" + props.start.toISOString() + "&end=" + props.end.toISOString();
            else
                url = GetBackEndUrl() + "/api/ro-stats";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // Update
                setTotal(res.data.totalFulfilledPaiement);
                setTotalRoCount(res.data.totalExits);
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
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Statistiques des Ordres de Réparations</h4>
            <br />
            <div className='grid grid-cols-2 gap-2 text-gray-300 text-left m-2 border-2 border-gray-500 p-2 rounded-xl'>
                <div className={leftCellStyle}>Réparations Validées</div><div className={rightCellStyle + ' border-2 border-green-800'} >{totalRoCount ? totalRoCount : "0"}</div>
                <div className={leftCellStyle}>Total des Paiements</div><div className={rightCellStyle + ' border-4 border-green-500'} >{total ? total : "0"} DA</div>
            </div>
        </div>
    )
}

export default RepairOrderStats