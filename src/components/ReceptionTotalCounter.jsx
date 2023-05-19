import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';

const ReceptionTotalCounter = (props) => {

    // Effects
    useEffect(() => {

        GetReceptionTotal();

    }, [props]);

    // States
    const [total, setTotal] = useState(0);

    const GetReceptionTotal = async () => {
        let res;

        try {

            // Build Req/Res
            let url;

            if (props.start && props.end)
                url = GetBackEndUrl() + "/api/get-reception-total?start=" + props.start.toISOString() + "&end=" + props.end.toISOString();
            else
                url = GetBackEndUrl() + "/api/get-reception-total";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {

                setTotal(res.data.total);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    return (
        <div className='bg-gray-700 border-4 border-gray-500 rounded-xl text-gray-100 text-3xl p-4 m-4 font-bold'>
            {"Total des Réceptions : " + total + " DA"}
        </div>
    )
}

export default ReceptionTotalCounter