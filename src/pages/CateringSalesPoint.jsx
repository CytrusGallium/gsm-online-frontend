import { React, useState, useEffect } from 'react';
import NetImage from '../components/NetImage';
import GetBackEndUrl from '../const';
import axios from 'axios';

const CateringSalesPoint = () => {

    useEffect(() => {
        GetProductListFromDb();
    }, []);

    const [productList, setProductList] = useState([]);
    const [consumedProductsList, setConsumedProductsList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const gridStyle = { display: 'grid', gridTemplateRows: '320px 256px' };

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setProductList(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const handleProductOnClick = (ParamProduct) => {
        console.log(JSON.stringify(ParamProduct));
        // console.log("L1 = " + consumedProductsList.length);
        setConsumedProductsList(consumedProductsList => [...consumedProductsList, ParamProduct]);
        // console.log("L2 = " + consumedProductsList.length);
    }

    const GetTotalPrice = () => {
        var total = 0;
        consumedProductsList.forEach(p => {
            total += p.price;
        });
        return total;
    }

    return (
        // <div className='m-auto' style={gridStyle}>
        <div className='m-auto'>
            <div className='flex'>
                {productList.map(p => <NetImage value={p} key={p._id} onClick={() => handleProductOnClick(p)} />)}
            </div>
            <br />
            <br />
            <div className='bg-gray-900 w-full h-128 rounded-xl ml-4 text-gray-100 py-4 border-2 border-gray-100'>
                <p>La commande du client :</p>
                <br />
                <div className='flex flex-wrap'>
                    {consumedProductsList.map(p => <p className='inline m-2 bg-gray-700 rounded-xl p-3' key={p._id}>{p.name}</p>)}
                </div>
                <br />
                <div className='text-gray-500'>---------------------------------------------------------------</div>
                <p className='my-4 text-3xl font-bold'>Prix Total : {GetTotalPrice()} DA</p>
            </div>
        </div>
    )
}

export default CateringSalesPoint