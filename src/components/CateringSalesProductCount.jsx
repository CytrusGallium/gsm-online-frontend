import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart, BarSeries, Bar, BarLabel } from 'reaviz';

const CateringSalesProductCount = () => {

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, []);

    // States
    // const [salesInfo, setSalesInfo] = useState({ salesCount: 0, salesTotal: 0, salesTotalPayment: 0, salesDiff: 0, salesDiffPercentage: 0 });
    const [products, setproducts] = useState({});
    const [chartData, setChartData] = useState(null);

    // const leftCellStyle = 'mt-2';
    // const rightCellStyle = 'font-bold bg-gray-700 p-2 rounded-xl';

    const GetCateringOrdersListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-catering-orders-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res.data));
                // console.log("RESULT COUNT = " + res.data.length);

                let tmpProducts = {};
                res.data.forEach(sale => {
                    if (sale.consumedProducts) {
                        Object.keys(sale.consumedProducts).forEach(k => {
                            // console.log("K = " + k);
                            let productInfo;
                            if (tmpProducts[k])
                                productInfo = { name: sale.consumedProducts[k].name, amount: tmpProducts[k].amount + sale.consumedProducts[k].amount };
                            else
                                productInfo = { name: sale.consumedProducts[k].name, amount: sale.consumedProducts[k].amount };

                            tmpProducts[k] = productInfo;
                        });
                    }
                    // console.log("P = " + JSON.stringify(sale.consumedProducts));
                });

                // Build chart data
                let data = [];
                Object.keys(tmpProducts).forEach(k => {
                    data.push({ key: tmpProducts[k].name, data: tmpProducts[k].amount });
                });

                // Sort
                data.sort((a, b) => b.data-a.data);

                // Update
                setChartData(data);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    // const position = select(
    //     'Position',
    //     {
    //         top: 'top',
    //         center: 'center',
    //         bottom: 'bottom'
    //     },
    //     'top'
    // );
    // const fill = color('Color', '');

    return (
        <div className='flex flex-col items-center'>
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Vente(s) par produit</h4>
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

export default CateringSalesProductCount