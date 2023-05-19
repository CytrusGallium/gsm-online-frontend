import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const CateringSalesProductCount = (props) => {

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, [props]);

    // States
    // const [products, setproducts] = useState({});
    const [chartData, setChartData] = useState(null);

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

                let tmpProducts = {};
                res.data.forEach(sale => {
                    if (sale.consumedProducts) {
                        Object.keys(sale.consumedProducts).forEach(k => {
                            let productInfo;
                            if (tmpProducts[k])
                                productInfo = { name: sale.consumedProducts[k].name, amount: tmpProducts[k].amount + sale.consumedProducts[k].amount };
                            else
                                productInfo = { name: sale.consumedProducts[k].name, amount: sale.consumedProducts[k].amount };

                            tmpProducts[k] = productInfo;
                        });
                    }
                });

                // Build chart data
                let data = [];
                Object.keys(tmpProducts).forEach(k => {
                    data.push({ key: tmpProducts[k].name, data: tmpProducts[k].amount });
                });

                // Sort
                data.sort((a, b) => b.data - a.data);

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