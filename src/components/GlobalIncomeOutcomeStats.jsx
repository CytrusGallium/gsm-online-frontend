import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';

const GlobalIncomeOutcomeStats = (props) => {

    const leftCellStyle = 'mt-2';
    const rightCellStyle = 'font-bold bg-gray-700 p-2 rounded-xl';

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();
        GetReceptionTotal();
        GetFeeStatsFromDB();

    }, [props]);

    // States
    const [paymentTotal, setPaymentTotal] = useState(null);
    const [receptionTotal, setReceptionTotal] = useState(null);
    const [feeTotal, setFeeTotal] = useState(null);

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
                setReceptionTotal(res.data.total);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

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

                let tmpTotal = 0;

                if (res.data) {
                    res.data.forEach(co => {
                        tmpTotal += co.fulfilledPaiement;
                    });
                }

                setPaymentTotal(tmpTotal);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

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
                setFeeTotal(res.data.total);
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
            <div className='grid grid-cols-2 gap-2 text-gray-300 text-left m-2 border-2 border-gray-500 p-2 rounded-xl'>
                <div className={leftCellStyle}>Total des Paiements</div><div className={rightCellStyle + ' border-4 border-green-500'} >{paymentTotal ? paymentTotal : "0"} DA</div>
                <div className={leftCellStyle}>Total des Réceptions</div><div className={rightCellStyle + ' border-2 border-red-500'} >{receptionTotal ? receptionTotal : "0"} DA</div>
                <div className={leftCellStyle}>Total des Frais</div><div className={rightCellStyle + ' border-2 border-red-500'} >{feeTotal ? feeTotal : "0"} DA</div>
                <div className={leftCellStyle}>Marge Bénéficiaire</div><div className={rightCellStyle + ' border-2 border-blue-500'} >{Number(paymentTotal) - Number(receptionTotal) - Number(feeTotal)} DA</div>
                <div className={leftCellStyle}>Marge Bénéficiaire en Pourcentage</div><div className={rightCellStyle + ' border-2 border-blue-500'} >{((Number(paymentTotal) - Number(receptionTotal) - Number(feeTotal)) / Number(paymentTotal) * 100).toFixed(3)} %</div>
            </div>
        </div>
    )
}

export default GlobalIncomeOutcomeStats