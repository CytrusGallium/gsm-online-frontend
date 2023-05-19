import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const CateringSalesRevenueStats = (props) => {

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, [props]);

    // States
    const [salesInfo, setSalesInfo] = useState({ salesCount: 0, salesTotal: 0, salesTotalPayment: 0, salesDiff: 0, salesDiffPercentage: 0 });
    const [chartData, setChartData] = useState(null);

    const leftCellStyle = 'mt-2';
    const rightCellStyle = 'font-bold bg-gray-700 p-2 rounded-xl';

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
                // this.setState({ isBusy: false });

                let total = GetTotalConsumptionPrice(res.data);
                let payment = GetTotalFulfilledPaiement(res.data);

                setSalesInfo({
                    salesCount: res.data.length,
                    salesTotal: total,
                    salesTotalPayment: payment,
                    salesDiff: total - payment,
                    salesDiffPercentage: ((total - payment) / total * 100).toFixed(2)
                });

                const data = [
                    { key: 'Total', data: total },
                    { key: 'Paiement', data: payment },
                ];

                setChartData(data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetTotalConsumptionPrice = (ParamCoList) => {
        let result = 0;

        ParamCoList.forEach(co => {
            result += co.totalPrice;
        });

        return result;
    }

    const GetTotalFulfilledPaiement = (ParamCoList) => {
        let result = 0;

        ParamCoList.forEach(co => {
            result += co.fulfilledPaiement;
        });

        return result;
    }

    return (
        <div className='flex flex-col items-center'>
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Revenue des ventes</h4>
            <div className='grid grid-cols-2 gap-2 text-gray-300 text-left m-2 border-2 border-gray-500 p-2 rounded-xl'>
                <div className={leftCellStyle}>Nombre de ventes</div><div className={rightCellStyle + ' border-2 border-green-700'} >{salesInfo.salesCount}</div>
                <div className={leftCellStyle}>Total des ventes</div><div className={rightCellStyle + ' border-2 border-blue-700'} >{salesInfo.salesTotal} DA</div>
                <div className={leftCellStyle}>Total des paiements</div><div className={rightCellStyle + ' border-4 border-green-500'} >{salesInfo.salesTotalPayment} DA</div>
                <div className={leftCellStyle}>Différence</div><div className={rightCellStyle + ' border-2 border-pink-500'} >{salesInfo.salesDiff} DA</div>
                <div className={leftCellStyle}>Différence en pourcentage</div><div className={rightCellStyle + ' border-2 border-pink-500'} >{salesInfo.salesDiffPercentage} %</div>
            </div>
            <br />
            {chartData && <BarChart width={320} height={256} data={chartData} />}
            <br />
            <br />
        </div>
    )
}

export default CateringSalesRevenueStats