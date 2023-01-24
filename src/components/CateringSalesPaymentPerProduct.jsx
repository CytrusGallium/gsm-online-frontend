import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import { BarChart } from 'reaviz';

const CateringSalesPaymentPerProduct = () => {

    // Effects
    useEffect(() => {

        GetCateringOrdersListFromDB();

    }, []);

    // States
    // const [products, setproducts] = useState({});
    const [chartData, setChartData] = useState(null);

    const GetCateringOrdersListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-catering-orders-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res.data));

                let tmpProducts = {};
                res.data.forEach(sale => {
                    let priceModifier = 0;
                    
                    try {
                        priceModifier = sale.fulfilledPaiement / sale.totalPrice;
                    } catch (error) {
                        console.log("Price modifier calculation error : " + error + " /// Payment = " + sale.fulfilledPaiement + " /// Total Price = " + sale.totalPrice);
                    }

                    console.log("PM = " + priceModifier);

                    if (sale.consumedProducts) {
                        Object.keys(sale.consumedProducts).forEach(k => {
                            console.log("P = " + JSON.stringify(sale.consumedProducts[k]));
                            let productInfo;
                            if (tmpProducts[k])
                                productInfo = { name: sale.consumedProducts[k].name, price: (sale.consumedProducts[k].amount * sale.consumedProducts[k].price * priceModifier) + tmpProducts[k].price };
                            else
                                productInfo = { name: sale.consumedProducts[k].name, price: (sale.consumedProducts[k].amount * sale.consumedProducts[k].price * priceModifier) };

                            tmpProducts[k] = productInfo;
                        });
                    }
                });

                // Build chart data
                let data = [];
                Object.keys(tmpProducts).forEach(k => {
                    data.push({ key: tmpProducts[k].name, data: tmpProducts[k].price });
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
            <h4 className='text-xl font-bold text-gray-100 mb-2' >Vente par produit en DA</h4>
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

export default CateringSalesPaymentPerProduct